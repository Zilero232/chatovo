import type { FindRoomParticipantInput } from '../../livekit.types';

import { AppForbiddenException } from '../../../../common/exceptions';
import { findRoomParticipant } from '../../presence-store';

/** Whether the user sits in the room's voice call in admin invisible mode. */
export const isInvisibleInRoom = (input: FindRoomParticipantInput): boolean =>
  findRoomParticipant(input)?.invisible === true;

/** Throws INVISIBLE_READ_ONLY for an invisible participant: any visible action would reveal them. */
export const assertVisibleInRoom = (input: FindRoomParticipantInput): void => {
  if (isInvisibleInRoom(input)) {
    throw new AppForbiddenException('INVISIBLE_READ_ONLY', 'Invisible participants stay silent');
  }
};
