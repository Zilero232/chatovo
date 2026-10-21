import type { RoomBan } from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';
import { isNonNullish, isNullish } from 'remeda';

import type {
  AssertIsRoomParticipantInput,
  ListRoomBansInput,
  ModerateParticipantInput,
  NotifyModerationInput,
  UnbanRoomUserInput
} from './room-moderation.service.types';

import { AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { assertCanModerateRoom } from '../../../../lib';
import {
  findRoomParticipant,
  lockMic,
  removeRoomParticipant,
  revokeRoomGrant,
  setParticipantMicLock,
  unlockMic
} from '../../../livekit';
import { emitUserEvent, unsubscribeUserFromRoom } from '../../../realtime';
import { assertModerationTarget } from '../../lib';
import { roomBanInclude, toRoomBan } from '../../mappers';

@Injectable()
export class RoomModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async listBans({ roomId, userId }: ListRoomBansInput): Promise<RoomBan[]> {
    await assertCanModerateRoom({ roomId, userId });

    const bans = await this.prisma.roomBan.findMany({
      where: { roomId },
      include: roomBanInclude,
      orderBy: { createdAt: 'desc' }
    });

    return bans.map(toRoomBan);
  }

  async unbanUser({ roomId, userId, targetId }: UnbanRoomUserInput): Promise<void> {
    await assertCanModerateRoom({ roomId, userId });

    await this.prisma.roomBan.deleteMany({ where: { roomId, userId: targetId } });
  }

  async removeParticipant({ roomId, userId, targetId }: ModerateParticipantInput): Promise<void> {
    const room = await this.assertCanModerateTarget({ roomId, userId, targetId });

    this.assertIsRoomParticipant({ roomId, targetId });

    unlockMic({ roomId, userId: targetId });
    this.notify({ room, targetId, action: 'removed' });

    await removeRoomParticipant({ roomId, identity: targetId });
  }

  async banParticipant({ roomId, userId, targetId }: ModerateParticipantInput): Promise<void> {
    const room = await this.assertCanModerateTarget({ roomId, userId, targetId });
    const isParticipant = isNonNullish(findRoomParticipant({ roomId, identity: targetId }));

    await this.prisma.roomBan.upsert({
      where: { roomId_userId: { roomId, userId: targetId } },
      create: { roomId, userId: targetId, bannedById: userId },
      update: {}
    });

    revokeRoomGrant({ roomId, userId: targetId });
    unsubscribeUserFromRoom({ roomId, userId: targetId });
    unlockMic({ roomId, userId: targetId });

    if (isParticipant) {
      this.notify({ room, targetId, action: 'banned' });
    }

    await removeRoomParticipant({ roomId, identity: targetId });
  }

  async muteParticipant({ roomId, userId, targetId }: ModerateParticipantInput): Promise<void> {
    const room = await this.assertCanModerateTarget({ roomId, userId, targetId });

    this.assertIsRoomParticipant({ roomId, targetId });

    lockMic({ roomId, userId: targetId });

    await setParticipantMicLock({ roomId, identity: targetId, locked: true });

    this.notify({ room, targetId, action: 'muted' });
  }

  async unmuteParticipant({ roomId, userId, targetId }: ModerateParticipantInput): Promise<void> {
    const room = await this.assertCanModerateTarget({ roomId, userId, targetId });

    this.assertIsRoomParticipant({ roomId, targetId });

    unlockMic({ roomId, userId: targetId });

    await setParticipantMicLock({ roomId, identity: targetId, locked: false });

    this.notify({ room, targetId, action: 'unmuted' });
  }

  private async assertCanModerateTarget({ roomId, userId, targetId }: ModerateParticipantInput) {
    const [room, target] = await Promise.all([
      assertCanModerateRoom({ roomId, userId }),
      this.prisma.user.findUnique({ where: { id: targetId }, select: { role: true } })
    ]);

    if (isNullish(target)) {
      throw new AppNotFoundException('USER_NOT_FOUND', 'User not found');
    }

    assertModerationTarget({
      actorId: userId,
      ownerId: room.ownerId,
      targetId,
      targetRole: target.role
    });

    return room;
  }

  private assertIsRoomParticipant({ roomId, targetId }: AssertIsRoomParticipantInput): void {
    if (isNullish(findRoomParticipant({ roomId, identity: targetId }))) {
      throw new AppNotFoundException('USER_NOT_FOUND', 'Not a participant of this room');
    }
  }

  private notify({ room, targetId, action }: NotifyModerationInput) {
    emitUserEvent(targetId, {
      type: 'room.moderation',
      roomId: room.id,
      roomName: room.name,
      action
    });
  }
}
