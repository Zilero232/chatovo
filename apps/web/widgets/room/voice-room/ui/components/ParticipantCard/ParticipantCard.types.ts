import type { Participant } from 'livekit-client';

export type ParticipantCardProps = {
  activity: string | null;
  deafened: boolean;
  fill?: boolean;
  invisible?: boolean;
  participant: Participant;
};
