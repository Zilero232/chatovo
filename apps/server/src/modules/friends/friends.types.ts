import type { DmCallEndReason, DmCallState, FriendUser } from '@chatovo/schemas';

export type DmCall = {
  answeredAt: number | null;
  callee: FriendUser;
  calleeReachable: boolean;
  caller: FriendUser;
  callerOfflineSince: number | null;
  endReason: DmCallEndReason | null;
  endedAt: number | null;
  everJoined: string[];
  graceEndsAt: number | null;
  id: string;
  inCall: string[];
  legacyAcked: boolean;
  ringEndsAt: number | null;
  roomId: string;
  startedAt: number;
  state: DmCallState;
};

export type DmCallEvent =
  | { type: 'accept' }
  | { type: 'blocked' }
  | { type: 'callerOffline' }
  | { type: 'callerOnline' }
  | { type: 'cancel' }
  | { type: 'decline' }
  | { type: 'hangup'; userId: string }
  | { type: 'joined'; userId: string }
  | { type: 'left'; userId: string }
  | { type: 'tick' };

export type CallsBetweenInput = {
  otherUserId: string;
  userId: string;
};

export type StartDmCallInput = {
  callee: FriendUser;
  calleeReachable: boolean;
  caller: FriendUser;
  roomId: string;
};

export type DmCallVoiceInput = {
  roomId: string;
  userId: string;
};

export type HangupDmCallInput = {
  callId: string;
  userId: string;
};
