import type { ParticipantInfo } from 'livekit-server-sdk';

export type HandleWebhookInput = {
  body: string;
  authHeader: string | undefined;
};

export type ParticipantJoinedInput = {
  participant: ParticipantInfo;
  roomId: string;
};

export type ParticipantLeftInput = {
  participant: ParticipantInfo;
  roomId: string;
};
