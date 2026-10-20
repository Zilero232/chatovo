import type { RoomParticipant } from '@chatovo/schemas';

export type RoomParticipantListProps = {
  ownerId: string;
  participants: RoomParticipant[];
};
