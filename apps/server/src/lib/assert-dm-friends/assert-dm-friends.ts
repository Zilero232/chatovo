import { isNullish } from 'remeda';

import type { AssertDmFriendsInput } from './assert-dm-friends.types';

import { FriendshipStatus, RoomKind } from '../../../generated';
import { AppForbiddenException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';
import { getRoomDmRouting } from '../get-room-dm-routing';

/** Refuses the voice of a DM room unless its two members are still friends; other rooms pass. */
export const assertDmFriends = async ({ roomId, userId }: AssertDmFriendsInput): Promise<void> => {
  const room = await getRoomDmRouting(roomId);

  if (room?.kind !== RoomKind.dm) {
    return;
  }

  const otherUserId = room.dmUserAId === userId ? room.dmUserBId : room.dmUserAId;

  const friendship = isNullish(otherUserId)
    ? null
    : await prisma.friendship.findFirst({
        where: {
          status: FriendshipStatus.accepted,
          OR: [
            { requesterId: userId, addresseeId: otherUserId },
            { requesterId: otherUserId, addresseeId: userId }
          ]
        },
        select: { id: true }
      });

  if (isNullish(friendship)) {
    throw new AppForbiddenException('DM_NOT_FRIENDS', 'Only friends can call');
  }
};
