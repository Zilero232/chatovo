import type { RoomParticipant } from '@chatovo/schemas';

export type RoomParticipantEntryProps = {
  isOwner: boolean;
  participant: RoomParticipant;
};
