import { isNullish } from 'remeda';

import type { AssertRoomTierInput } from './assert-room-tier.types';

import { RoomKind } from '../../../generated';
import { AppForbiddenException, AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';
import { assertNotBlocked } from '../assert-not-blocked';
import { assertNotRoomBanned } from '../assert-not-room-banned';
import { canAccessRoom } from '../can-access-room';
import { roomAccessSelect } from '../selectors';

/**
 * Loads the room and enforces one access tier, throwing `ROOM_NOT_FOUND` when it is gone and
 * `ROOM_BANNED` on `access` for a banned user. A denied DM reports plain `FORBIDDEN`.
 */
export const assertRoomTier = async ({
  roomId,
  userId,
  tier
}: AssertRoomTierInput): Promise<void> => {
  await assertNotBlocked(userId);

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: roomAccessSelect
  });

  if (isNullish(room)) {
    throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
  }

  if (canAccessRoom({ room, userId, tier })) {
    if (tier === 'access') {
      await assertNotRoomBanned({ roomId, userId });
    }

    return;
  }

  if (room.kind === RoomKind.dm || tier === 'view') {
    throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
  }

  throw new AppForbiddenException('ROOM_ACCESS_DENIED', 'Room access denied');
};
