import type { VoiceAttendee, VoiceSession, VoiceSessionEvent } from '../../telegram.types';

export type ApplyVoiceEventInput = {
  event: VoiceSessionEvent;
  now: number;
  session: VoiceSession | null;
};

export type CloseStintInput = {
  attendee: VoiceAttendee;
  now: number;
};
