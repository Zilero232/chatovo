import type { AssertRoomAccessInput } from './assert-room-access.types';

import { RoomKind } from '../../../../../generated';
import { AppForbiddenException, AppInternalException } from '../../../../common/exceptions';
import { verifyRoomPassword } from '../../../../lib';
import { hasVisibleRoomGrant } from '../../room-grant-store';

export const assertRoomAccess = async ({
  room,
  userId,
  password
}: AssertRoomAccessInput): Promise<void> => {
  if (
    room.kind === RoomKind.dm ||
    !room.isPrivate ||
    hasVisibleRoomGrant({ roomId: room.id, userId })
  ) {
    return;
  }

  if (!password) {
    throw new AppForbiddenException('ROOM_PASSWORD_REQUIRED', 'Password required');
  }

  if (!room.password) {
    throw new AppInternalException('INTERNAL_ERROR', 'Room misconfigured');
  }

  if (!(await verifyRoomPassword(password, room.password))) {
    throw new AppForbiddenException('ROOM_PASSWORD_INVALID', 'Invalid password');
  }
};
