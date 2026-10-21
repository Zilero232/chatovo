import type { AssertNotRoomBannedInput } from './assert-not-room-banned.types';

import { AppForbiddenException } from '../../common/exceptions';
import { findBannedRoomIds } from '../find-banned-room-ids';

/** Throws ROOM_BANNED while a moderator of the room keeps the user banned from it; admins pass. */
export const assertNotRoomBanned = async ({
  roomId,
  userId
}: AssertNotRoomBannedInput): Promise<void> => {
  const banned = await findBannedRoomIds({ roomIds: [roomId], userId });

  if (banned.has(roomId)) {
    throw new AppForbiddenException('ROOM_BANNED', 'Banned from this room');
  }
};
