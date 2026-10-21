import { USER_ROLE } from '@chatovo/schemas';

import type { FindBannedRoomIdsInput } from './find-banned-room-ids.types';

import { basePrisma as prisma } from '../../core';

/** The rooms among `roomIds` a room ban keeps the user out of; always empty for an app admin. */
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

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });

  if (user?.role === USER_ROLE.admin) {
    return new Set();
  }

  return new Set(bans.map(({ roomId }) => roomId));
};
