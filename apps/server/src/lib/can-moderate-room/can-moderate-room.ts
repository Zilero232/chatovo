import type { CanModerateRoomInput } from './can-moderate-room.types';

import { RoomKind } from '../../../generated';

/** The room moderation rule: the owner of a group room and every app admin; a DM has no moderator. */
export const canModerateRoom = ({ room, userId, isAdmin }: CanModerateRoomInput): boolean => {
  if (room.kind !== RoomKind.group) {
    return false;
  }

  return isAdmin || room.ownerId === userId;
};
