import type { FriendEntry, FriendRequestEntry, FriendshipRelation } from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';

import type {
  AcceptFriendRequestInput,
  BroadcastFriendPresenceInput,
  CreateFriendshipRequestInput,
  DeclineFriendRequestInput,
  FindFriendshipInput,
  GetFriendshipRelationInput,
  RemoveFriendshipInput,
  SendFriendRequestInput,
  UserBlockState
} from './friendship.service.types';

import { FriendshipStatus, Prisma } from '../../../../../generated';
import {
  AppBadRequestException,
  AppConflictException,
  AppForbiddenException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { getUserWithProfileOrThrow } from '../../../../lib';
import { emitUserEvent } from '../../../realtime';
import { bumpFriendsEpoch, endCallsBetween } from '../../call-store';
import {
  friendshipInclude,
  normalizeFriendTag,
  otherUser,
  toFriendUser,
  toRelation
} from '../../mappers';

@Injectable()
export class FriendshipService {
  constructor(private readonly prisma: PrismaService) {}

  private findFriendship({ userId, otherUserId }: FindFriendshipInput) {
    return this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: otherUserId },
          { requesterId: otherUserId, addresseeId: userId }
        ]
      },
      include: friendshipInclude
    });
  }

  private async findUserBlocks({
    userId,
    otherUserId
  }: FindFriendshipInput): Promise<UserBlockState> {
    const [mine, theirs] = await Promise.all([
      this.prisma.userBlock.findUnique({
        where: { blockerId_blockedId: { blockerId: userId, blockedId: otherUserId } },
        select: { blockerId: true }
      }),
      this.prisma.userBlock.findUnique({
        where: { blockerId_blockedId: { blockerId: otherUserId, blockedId: userId } },
        select: { blockerId: true }
      })
    ]);

    return { blockedByMe: !isNullish(mine), blockedByThem: !isNullish(theirs) };
  }

  async listFriends(userId: string): Promise<FriendEntry[]> {
    const rows = await this.prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.accepted,
        OR: [{ requesterId: userId }, { addresseeId: userId }]
      },
      include: friendshipInclude,
      orderBy: { updatedAt: 'desc' }
    });

    return rows.map((row) => ({
      friendshipId: row.id,
      user: toFriendUser(otherUser(row, userId)),
      since: row.updatedAt.toISOString()
    }));
  }

  async broadcastFriendPresence({ userId, isOnline }: BroadcastFriendPresenceInput): Promise<void> {
    const rows = await this.prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.accepted,
        OR: [{ requesterId: userId }, { addresseeId: userId }]
      },
      select: { requesterId: true, addresseeId: true }
    });

    for (const row of rows) {
      const friendId = row.requesterId === userId ? row.addresseeId : row.requesterId;

      emitUserEvent(friendId, { type: 'friend.presence', userId, isOnline });
    }
  }

  async listIncomingRequests(userId: string): Promise<FriendRequestEntry[]> {
    const rows = await this.prisma.friendship.findMany({
      where: { addresseeId: userId, status: FriendshipStatus.pending },
      include: friendshipInclude,
      orderBy: { createdAt: 'desc' }
    });

    return rows.map((row) => ({
      friendshipId: row.id,
      user: toFriendUser(row.requester),
      requestedAt: row.createdAt.toISOString()
    }));
  }

  async getFriendshipRelation({
    userId,
    otherUserId
  }: GetFriendshipRelationInput): Promise<FriendshipRelation> {
    if (userId === otherUserId) {
      return { status: 'none' };
    }

    const [block, row] = await Promise.all([
      this.prisma.userBlock.findUnique({
        where: { blockerId_blockedId: { blockerId: userId, blockedId: otherUserId } },
        select: { blockerId: true }
      }),
      this.findFriendship({ userId, otherUserId })
    ]);

    if (!isNullish(block)) {
      return { status: 'blocked' };
    }

    if (isNullish(row)) {
      return { status: 'none' };
    }

    return toRelation(row, userId);
  }

  private async createFriendshipRequest({
    requesterId,
    addresseeId
  }: CreateFriendshipRequestInput): Promise<FriendshipRelation> {
    if (requesterId === addresseeId) {
      throw new AppBadRequestException('FRIEND_SELF', 'Cannot friend yourself');
    }

    await getUserWithProfileOrThrow(addresseeId);

    const { blockedByMe, blockedByThem } = await this.findUserBlocks({
      userId: requesterId,
      otherUserId: addresseeId
    });

    if (blockedByMe) {
      throw new AppForbiddenException('FRIEND_REQUEST_BLOCKED', 'Friend request blocked');
    }

    if (blockedByThem) {
      throw new AppNotFoundException('USER_NOT_FOUND', 'User not found');
    }

    const existing = await this.findFriendship({ userId: requesterId, otherUserId: addresseeId });

    if (!isNullish(existing)) {
      if (existing.status === FriendshipStatus.accepted) {
        throw new AppConflictException('FRIEND_ALREADY', 'Already friends');
      }

      if (existing.requesterId === addresseeId) {
        throw new AppConflictException(
          'FRIEND_REQUEST_INCOMING_EXISTS',
          'This user already sent you a request'
        );
      }

      return toRelation(existing, requesterId);
    }

    try {
      const row = await this.prisma.friendship.create({
        data: { requesterId, addresseeId },
        include: friendshipInclude
      });

      bumpFriendsEpoch(requesterId, addresseeId);

      return toRelation(row, requesterId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppConflictException('FRIEND_REQUEST_EXISTS', 'Friend request already exists');
      }

      throw error;
    }
  }

  async sendFriendRequest({
    requesterId,
    tag
  }: SendFriendRequestInput): Promise<FriendshipRelation> {
    const target = await this.prisma.user.findUnique({
      where: { friendTag: normalizeFriendTag(tag) },
      select: { id: true }
    });

    if (isNullish(target)) {
      throw new AppNotFoundException('USER_NOT_FOUND', 'User not found');
    }

    return this.createFriendshipRequest({ requesterId, addresseeId: target.id });
  }

  async acceptFriendRequest({
    userId,
    friendshipId
  }: AcceptFriendRequestInput): Promise<FriendshipRelation> {
    const request = await this.prisma.friendship.findFirst({
      where: { id: friendshipId, addresseeId: userId, status: FriendshipStatus.pending },
      select: { requesterId: true }
    });

    if (isNullish(request)) {
      throw new AppNotFoundException('FRIEND_REQUEST_NOT_FOUND', 'Request not found');
    }

    const { blockedByMe, blockedByThem } = await this.findUserBlocks({
      userId,
      otherUserId: request.requesterId
    });

    if (blockedByMe) {
      throw new AppForbiddenException('FRIEND_REQUEST_BLOCKED', 'Friend request blocked');
    }

    if (blockedByThem) {
      throw new AppNotFoundException('FRIEND_REQUEST_NOT_FOUND', 'Request not found');
    }

    const { count } = await this.prisma.friendship.updateMany({
      where: {
        id: friendshipId,
        addresseeId: userId,
        status: FriendshipStatus.pending
      },
      data: { status: FriendshipStatus.accepted }
    });

    if (count === 0) {
      throw new AppNotFoundException('FRIEND_REQUEST_NOT_FOUND', 'Request not found');
    }

    const updated = await this.prisma.friendship.findUniqueOrThrow({
      where: { id: friendshipId },
      include: friendshipInclude
    });

    bumpFriendsEpoch(userId, updated.requesterId);

    return toRelation(updated, userId);
  }

  async declineFriendRequest({ userId, friendshipId }: DeclineFriendRequestInput): Promise<void> {
    const row = await this.prisma.friendship.findUnique({ where: { id: friendshipId } });

    if (isNullish(row) || row.addresseeId !== userId || row.status !== FriendshipStatus.pending) {
      throw new AppNotFoundException('FRIEND_REQUEST_NOT_FOUND', 'Request not found');
    }

    await this.prisma.friendship.delete({ where: { id: friendshipId } });

    bumpFriendsEpoch(userId, row.requesterId);
  }

  async removeFriendship({ userId, otherUserId }: RemoveFriendshipInput): Promise<void> {
    const row = await this.findFriendship({ userId, otherUserId });

    if (isNullish(row)) {
      throw new AppNotFoundException('FRIENDSHIP_NOT_FOUND', 'Friendship not found');
    }

    if (row.status === FriendshipStatus.pending && row.requesterId !== userId) {
      throw new AppForbiddenException(
        'FRIEND_REQUEST_NOT_CANCELABLE',
        'Cannot cancel this request'
      );
    }

    await this.prisma.friendship.delete({ where: { id: row.id } });

    endCallsBetween({ userId, otherUserId });
    bumpFriendsEpoch(userId, otherUserId);
  }

  async assertAreFriends({ userId, otherUserId }: FindFriendshipInput): Promise<void> {
    const relation = await this.findFriendship({ userId, otherUserId });

    if (isNullish(relation) || relation.status !== FriendshipStatus.accepted) {
      throw new AppForbiddenException('DM_NOT_FRIENDS', 'Only friends can open DM');
    }
  }
}
