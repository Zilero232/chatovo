import type { Participant } from 'livekit-client';
import type { ReactNode } from 'react';

export type ParticipantCardMenuProps = {
  children: ReactNode;
  participant: Participant;
};
