import { hasPermission } from '@chatovo/schemas';

import type { CanModerateRoomInput } from './can-moderate-room.types';

import { RoomKind } from '../../../generated';

/** The room moderation rule: the owner of a group room and staff who moderate every room; a DM has no moderator. */
export const canModerateRoom = ({ room, userId, role }: CanModerateRoomInput): boolean => {
  if (room.kind !== RoomKind.group) {
    return false;
  }

  return hasPermission({ role, permission: 'moderateAnyRoom' }) || room.ownerId === userId;
};
