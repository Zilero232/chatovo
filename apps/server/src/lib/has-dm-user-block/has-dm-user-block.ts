import { isNullish } from 'remeda';

import type { HasDmUserBlockInput } from './has-dm-user-block.types';

import { RoomKind } from '../../../generated';
import { getRoomDmRouting } from '../get-room-dm-routing';
import { hasUserBlockBetween } from '../has-user-block-between';

/** True when the room is a DM and either member has blocked the other; false for any other room. */
export const hasDmUserBlock = async ({ roomId, userId }: HasDmUserBlockInput): Promise<boolean> => {
  const room = await getRoomDmRouting(roomId);

  if (room?.kind !== RoomKind.dm) {
    return false;
  }

  const otherUserId = room.dmUserAId === userId ? room.dmUserBId : room.dmUserAId;

  if (isNullish(otherUserId)) {
    return false;
  }

  return hasUserBlockBetween({ userId, otherUserId });
};
