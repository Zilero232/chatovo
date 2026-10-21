import type { IsBarredFromRoomInput } from './is-barred-from-room.types';

import { findBannedRoomIds, hasDmUserBlock } from '../../../../lib';

export const isBarredFromRoom = async ({
  roomId,
  userId
}: IsBarredFromRoomInput): Promise<boolean> => {
  const [banned, isDmBlocked] = await Promise.all([
    findBannedRoomIds({ roomIds: [roomId], userId }),
    hasDmUserBlock({ roomId, userId })
  ]);

  return banned.has(roomId) || isDmBlocked;
};
