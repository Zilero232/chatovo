import type { Participant } from 'livekit-client';

export type ParticipantMetadataProps = {
  activity: string | null;
  deafened: boolean;
  participant: Participant;
};
