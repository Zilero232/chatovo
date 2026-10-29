import type { FormattedString } from '@grammyjs/parse-mode';

export type VoiceJoinNotification = {
  isDm: boolean;
  participantId: string;
  participantName: string;
  roomId: string;
  roomName: string;
};

export type VoiceLeaveNotification = {
  participantId: string;
  roomId: string;
};

export type VoiceEmptyNotification = {
  roomId: string;
  roomName: string;
};

export type VoiceAttendee = {
  id: string;
  joinedAt: number | null;
  name: string;
  totalMs: number;
};

export type VoiceSession = {
  attendees: VoiceAttendee[];
  peakCount: number;
  presentIds: string[];
  roomName: string;
  startedAt: number;
};

export type VoiceSessionEvent =
  | { type: 'end' }
  | { type: 'join'; participantId: string; participantName: string; roomName: string }
  | { type: 'leave'; participantId: string };

export type VoicePresence = {
  activity: string | null;
  deafened: boolean;
  micMuted: boolean;
};

export type VoiceTrack = {
  artist: string | null;
  title: string;
};

export type VoiceRoomSnapshot = {
  presence: Record<string, VoicePresence>;
  track: VoiceTrack | null;
};

export type EditFailure =
  { kind: 'failed'; retryAfterMs: number | null } | { kind: 'missing' } | { kind: 'unchanged' };

export type EditOutcome = EditFailure | { kind: 'edited' };

export type UserSignupNotification = {
  email: string;
  name: string;
  signupsLastDay: number;
  totalUsers: number;
};

export type RoomCreatedNotification = {
  isPrivate: boolean;
  ownerName: string;
  roomId: string | null;
  roomName: string;
  totalRooms: number;
};

export type RoomDeletedNotification = {
  ownerName: string;
  roomName: string;
};

export type ProblemReportNotification = {
  appVersion?: string;
  description: string;
  email: string;
  platform?: string;
  reporter: string;
};

export type AbuseReportNotification = {
  comment?: string;
  reason: string;
  reporter: string;
  roomName?: string;
  target: string;
  targetId: string;
};

export type UserBlockedNotification = {
  blockedBy: string;
  email: string;
  reason: string;
  reportCount: number;
  userId: string;
  userName: string;
};

export type PostMessageInput = {
  message: FormattedString;
  silent?: boolean;
};

export type EditMessageInput = {
  message: FormattedString;
  messageId: number;
};

export type VoiceEntry = {
  attempts: number;
  emptySince: number | null;
  lastEditAt: number | null;
  lastText: string | null;
  messageId: number | null;
  queue: Promise<void>;
  refreshTimer: ReturnType<typeof setInterval> | null;
  session: VoiceSession;
  timer: ReturnType<typeof setTimeout> | null;
};

export type VoiceTarget = {
  entry: VoiceEntry;
  roomId: string;
};

export type DeliverVoiceInput = VoiceTarget & {
  isOver: boolean;
};

export type DeliverVoiceResult = { ok: false; retryAfterMs: number | null } | { ok: true };

export type UpdateVoiceSessionInput = {
  event: VoiceSessionEvent;
  roomId: string;
};

export type ReadVoiceRoomInput = {
  participantIds: string[];
  roomId: string;
};
