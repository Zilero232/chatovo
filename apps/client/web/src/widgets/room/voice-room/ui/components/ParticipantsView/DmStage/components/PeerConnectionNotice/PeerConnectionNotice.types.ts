import type { Participant } from 'livekit-client';

export type PeerConnectionNoticeProps = {
  name: string;
  participant: Participant;
};
