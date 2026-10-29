import type {
  VoiceAttendee,
  VoicePresence,
  VoiceRoomSnapshot,
  VoiceSession
} from '../../telegram.types';

export type FormatVoiceSessionInput = {
  isOver: boolean;
  now: number;
  session: VoiceSession;
  snapshot: VoiceRoomSnapshot;
  url: string;
};

export type DescribeAttendeeInput = {
  attendee: VoiceAttendee;
  presence: VoicePresence | undefined;
};
