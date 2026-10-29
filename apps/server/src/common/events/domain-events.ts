import type { ChatMessage, DmCallEndReason, FriendUser } from '@chatovo/schemas';

export const DomainEvent = {
  RoomCreated: 'room.created',
  RoomDeleted: 'room.deleted',
  UserSignedUp: 'user.signed-up',
  ProblemReported: 'problem.reported',
  VoiceJoined: 'voice.joined',
  VoiceLeft: 'voice.left',
  VoiceEmptied: 'voice.emptied',
  CallRinging: 'call.ringing',
  CallEnded: 'call.ended',
  DmMessageSent: 'dm.message-sent',
  AbuseReported: 'abuse.reported',
  UserBlocked: 'user.blocked'
} as const;

export type DomainEventPayloads = {
  [DomainEvent.AbuseReported]: {
    reportId: string;
    reporter: string;
    target: string;
    targetId: string;
    reason: string;
    comment?: string;
    roomName?: string;
  };
  [DomainEvent.CallRinging]: {
    callId: string;
    calleeId: string;
    caller: FriendUser;
    roomId: string;
  };
  [DomainEvent.CallEnded]: {
    callId: string;
    roomId: string;
    caller: FriendUser;
    callee: FriendUser;
    outcome: DmCallEndReason;
    answeredAt: string | null;
    endedAt: string;
    durationSec: number | null;
  };
  [DomainEvent.DmMessageSent]: {
    recipientId: string;
    message: ChatMessage;
  };
  [DomainEvent.ProblemReported]: {
    reporter: string;
    email: string;
    description: string;
    platform?: string;
    appVersion?: string;
  };
  [DomainEvent.RoomCreated]: {
    roomName: string;
    ownerName: string;
    isPrivate: boolean;
  };
  [DomainEvent.RoomDeleted]: {
    roomName: string;
    ownerName: string;
  };
  [DomainEvent.UserBlocked]: {
    userId: string;
    userName: string;
    email: string;
    reason: string;
    blockedBy: string;
  };
  [DomainEvent.UserSignedUp]: {
    name: string;
    email: string;
  };
  [DomainEvent.VoiceEmptied]: {
    roomId: string;
    roomName: string;
    isDm: boolean;
  };
  [DomainEvent.VoiceJoined]: {
    roomId: string;
    roomName: string;
    isDm: boolean;
    participantId: string;
    participantName: string;
  };
  [DomainEvent.VoiceLeft]: {
    roomId: string;
    isDm: boolean;
    participantId: string;
  };
};

export type RoomCreatedEvent = DomainEventPayloads[typeof DomainEvent.RoomCreated];
export type RoomDeletedEvent = DomainEventPayloads[typeof DomainEvent.RoomDeleted];
export type UserSignedUpEvent = DomainEventPayloads[typeof DomainEvent.UserSignedUp];
export type ProblemReportedEvent = DomainEventPayloads[typeof DomainEvent.ProblemReported];
export type VoiceJoinedEvent = DomainEventPayloads[typeof DomainEvent.VoiceJoined];
export type VoiceLeftEvent = DomainEventPayloads[typeof DomainEvent.VoiceLeft];
export type VoiceEmptiedEvent = DomainEventPayloads[typeof DomainEvent.VoiceEmptied];
export type CallRingingEvent = DomainEventPayloads[typeof DomainEvent.CallRinging];
export type CallEndedEvent = DomainEventPayloads[typeof DomainEvent.CallEnded];
export type DmMessageSentEvent = DomainEventPayloads[typeof DomainEvent.DmMessageSent];
export type AbuseReportedEvent = DomainEventPayloads[typeof DomainEvent.AbuseReported];
export type UserBlockedEvent = DomainEventPayloads[typeof DomainEvent.UserBlocked];
