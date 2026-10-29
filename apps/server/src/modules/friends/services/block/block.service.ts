import type { UserBlockEntry } from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';

import type { BlockUserInput, EndDmCallInput, UnblockUserInput } from './block.service.types';

import { RoomKind } from '../../../../../generated';
import { AppBadRequestException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { getUserWithProfileOrThrow } from '../../../../lib';
import { removeRoomParticipant } from '../../../livekit';
import { bumpFriendsEpoch, endCallsBetween } from '../../call-store';
import { toUserBlockEntry, userBlockInclude } from '../../mappers';

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}

  async listBlockedUsers(userId: string): Promise<UserBlockEntry[]> {
    const rows = await this.prisma.userBlock.findMany({
      where: { blockerId: userId },
      include: userBlockInclude,
      orderBy: { createdAt: 'desc' }
    });

    return rows.map(toUserBlockEntry);
  }

  async blockUser({ userId, otherUserId }: BlockUserInput): Promise<UserBlockEntry> {
    if (userId === otherUserId) {
      throw new AppBadRequestException('BLOCK_SELF', 'Cannot block yourself');
    }

    const blocked = await getUserWithProfileOrThrow(otherUserId);

    const [block, removed] = await this.prisma.$transaction([
      this.prisma.userBlock.upsert({
        where: { blockerId_blockedId: { blockerId: userId, blockedId: otherUserId } },
        create: { blockerId: userId, blockedId: otherUserId },
        update: {}
      }),
      this.prisma.friendship.deleteMany({
        where: {
          OR: [
            { requesterId: userId, addresseeId: otherUserId },
            { requesterId: otherUserId, addresseeId: userId }
          ]
        }
      })
    ]);

    const affectedUserIds = removed.count > 0 ? [userId, otherUserId] : [userId];

    endCallsBetween({ userId, otherUserId });
    bumpFriendsEpoch(...affectedUserIds);

    await this.endDmCall({ userId, otherUserId });

    return toUserBlockEntry({ blocked, createdAt: block.createdAt });
  }

  private async endDmCall({ userId, otherUserId }: EndDmCallInput): Promise<void> {
    const room = await this.prisma.room.findFirst({
      where: {
        kind: RoomKind.dm,
        OR: [
          { dmUserAId: userId, dmUserBId: otherUserId },
          { dmUserAId: otherUserId, dmUserBId: userId }
        ]
      },
      select: { id: true }
    });

    if (isNullish(room)) {
      return;
    }

    await Promise.allSettled([
      removeRoomParticipant({ roomId: room.id, identity: userId }),
      removeRoomParticipant({ roomId: room.id, identity: otherUserId })
    ]);
  }

  async unblockUser({ userId, otherUserId }: UnblockUserInput): Promise<void> {
    const { count } = await this.prisma.userBlock.deleteMany({
      where: { blockerId: userId, blockedId: otherUserId }
    });

    if (count > 0) {
      bumpFriendsEpoch(userId);
    }
  }
}
