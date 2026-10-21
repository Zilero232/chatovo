import { USER_ROLE } from '@chatovo/schemas';
import { isNullish } from 'remeda';

import type { AssertCanModerateRoomInput } from './assert-can-moderate-room.types';

import { AppForbiddenException, AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';
import { canModerateRoom } from '../can-moderate-room';

/** Returns the room when the user owns it or is an app admin; throws ROOM_NOT_FOUND or FORBIDDEN. */
export const assertCanModerateRoom = async ({ roomId, userId }: AssertCanModerateRoomInput) => {
  const [room, user] = await Promise.all([
    prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true, name: true, kind: true, ownerId: true }
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  ]);

  if (isNullish(room)) {
    throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
  }

  if (!canModerateRoom({ room, userId, isAdmin: user?.role === USER_ROLE.admin })) {
    throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
  }

  return room;
};
