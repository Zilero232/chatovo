import { hasPermission } from '@chatovo/schemas';

import type { FindBannedRoomIdsInput } from './find-banned-room-ids.types';

import { basePrisma as prisma } from '../../core';
import { findUserRole } from '../find-user-role';

/** The rooms among `roomIds` a room ban keeps the user out of; always empty for staff who bypass bans. */
export const findBannedRoomIds = async ({
  roomIds,
  userId
}: FindBannedRoomIdsInput): Promise<Set<string>> => {
  if (roomIds.length === 0) {
    return new Set();
  }

  const bans = await prisma.roomBan.findMany({
    where: { userId, roomId: { in: roomIds } },
    select: { roomId: true }
  });

  if (bans.length === 0) {
    return new Set();
  }

  const role = await findUserRole(userId);

  if (hasPermission({ role, permission: 'bypassRoomBans' })) {
    return new Set();
  }

  return new Set(bans.map(({ roomId }) => roomId));
};
