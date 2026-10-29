import { isNullish } from 'remeda';

import type { AssertCanModerateRoomInput } from './assert-can-moderate-room.types';

import { AppForbiddenException, AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';
import { canModerateRoom } from '../can-moderate-room';
import { findUserRole } from '../find-user-role';

/** Returns the room and the actor's role when the user owns it or is staff; throws ROOM_NOT_FOUND or FORBIDDEN. */
export const assertCanModerateRoom = async ({ roomId, userId }: AssertCanModerateRoomInput) => {
  const [room, role] = await Promise.all([
    prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true, name: true, kind: true, ownerId: true }
    }),
    findUserRole(userId)
  ]);

  if (isNullish(room)) {
    throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
  }

  if (!canModerateRoom({ room, userId, role })) {
    throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
  }

  return { room, role };
};
