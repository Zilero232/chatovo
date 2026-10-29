import type { DmCallView, FriendCallStreamSnapshot, OutgoingFriendCall } from '@chatovo/schemas';

import { randomUUID } from 'node:crypto';
import { match } from 'ts-pattern';

import type {
  CallsBetweenInput,
  DmCall,
  DmCallEvent,
  DmCallVoiceInput,
  HangupDmCallInput,
  StartDmCallInput
} from './friends.types';

import { DomainEvent } from '../../common/events/domain-events';
import { emitDomainEvent } from '../../common/events/emit-domain-event';
import { closeLivekitRoom } from '../livekit';
import { emitFriendsSnapshot } from '../realtime';
import {
  createDmCall,
  dmCallDurationSec,
  endDmCall,
  isDmCallExpired,
  nextDmCallDeadline,
  reduceDmCall,
  toDmCallView
} from './lib';

const calls = new Map<string, DmCall>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const friendsEpochByUser = new Map<string, number>();

const isLive = (call: DmCall) => call.state !== 'ended';

const involves = (call: DmCall, userId: string) =>
  call.caller.id === userId || call.callee.id === userId;

const peerIdOf = (call: DmCall, userId: string) =>
  call.caller.id === userId ? call.callee.id : call.caller.id;

const callsOf = (userId: string) => [...calls.values()].filter((call) => involves(call, userId));

const isEngagedIn = (call: DmCall, userId: string) =>
  call.state === 'active' || (call.state === 'ringing' && call.caller.id === userId);

const isEngagedElsewhere = (userId: string, exceptCallId: string) =>
  callsOf(userId).some((call) => call.id !== exceptCallId && isEngagedIn(call, userId));

const latestEnded = (own: DmCall[]) =>
  own
    .filter((call) => call.state === 'ended')
    .sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0))[0];

export const findCall = (callId: string): DmCall | null => calls.get(callId) ?? null;

export const findCurrentCall = (userId: string): DmCall | null => {
  const own = callsOf(userId);

  return (
    own.find((call) => call.state === 'active') ??
    own.find((call) => call.state === 'ringing' && call.caller.id === userId) ??
    latestEnded(own) ??
    null
  );
};

export const findIncomingCall = (userId: string): DmCall | null =>
  callsOf(userId).find((call) => call.state === 'ringing' && call.callee.id === userId) ?? null;

export const toCallView = (call: DmCall, viewerId: string): DmCallView =>
  toDmCallView({
    call,
    viewerId,
    peerBusy: isEngagedElsewhere(peerIdOf(call, viewerId), call.id)
  });

const toLegacyOutgoing = (call: DmCall | null, userId: string): OutgoingFriendCall | null => {
  if (!call || call.caller.id !== userId || call.legacyAcked) {
    return null;
  }

  const status = match(call)
    .with({ state: 'ringing' }, () => 'ringing' as const)
    .with({ state: 'active' }, () => 'accepted' as const)
    .with({ state: 'ended', endReason: 'declined' }, () => 'declined' as const)
    .otherwise(() => null);

  return status === null ? null : { roomId: call.roomId, callee: call.callee, status };
};

export const getUserCallSnapshot = (userId: string): FriendCallStreamSnapshot => {
  const current = findCurrentCall(userId);
  const incoming = findIncomingCall(userId);

  return {
    incoming: incoming ? { roomId: incoming.roomId, caller: incoming.caller } : null,
    outgoing: toLegacyOutgoing(current, userId),
    friendsEpoch: friendsEpochByUser.get(userId) ?? 0,
    calls: {
      current: current ? toCallView(current, userId) : null,
      incoming: incoming ? toCallView(incoming, userId) : null
    }
  };
};

const emitUser = (userId: string) => {
  emitFriendsSnapshot(userId, getUserCallSnapshot(userId));
};

const emitAround = (call: DmCall) => {
  const affected = new Set([call.caller.id, call.callee.id]);

  for (const userId of [call.caller.id, call.callee.id]) {
    for (const other of callsOf(userId)) {
      affected.add(other.caller.id);
      affected.add(other.callee.id);
    }
  }

  for (const userId of affected) {
    emitUser(userId);
  }
};

const clearTimer = (callId: string) => {
  const timer = timers.get(callId);

  if (timer) {
    clearTimeout(timer);
    timers.delete(callId);
  }
};

const announceEnd = (call: DmCall) => {
  const { id, roomId, caller, callee, endReason, answeredAt, endedAt } = call;

  emitDomainEvent(DomainEvent.CallEnded, {
    callId: id,
    roomId,
    caller,
    callee,
    outcome: endReason ?? 'completed',
    answeredAt: answeredAt === null ? null : new Date(answeredAt).toISOString(),
    endedAt: new Date(endedAt ?? Date.now()).toISOString(),
    durationSec: dmCallDurationSec(call)
  });

  const isRoomReused = [...calls.values()].some(
    (other) => other.id !== id && other.roomId === roomId && isLive(other)
  );

  if (call.inCall.length > 0 && !isRoomReused) {
    void closeLivekitRoom(roomId);
  }
};

const commit = (previous: DmCall | null, next: DmCall): DmCall => {
  clearTimer(next.id);

  if (isDmCallExpired({ call: next, now: Date.now() })) {
    calls.delete(next.id);
    emitAround(next);

    return next;
  }

  calls.set(next.id, next);

  const deadline = nextDmCallDeadline(next);

  if (deadline !== null) {
    timers.set(
      next.id,
      // eslint-disable-next-line ts/no-use-before-define -- the timer and dispatch call each other; both run only after module init
      setTimeout(dispatch, Math.max(0, deadline - Date.now()), next.id, { type: 'tick' })
    );
  }

  if (previous !== next) {
    emitAround(next);
  }

  if (previous?.state !== 'ended' && next.state === 'ended') {
    announceEnd(next);
  }

  return next;
};

const dispatch = (callId: string, event: DmCallEvent): DmCall | null => {
  const call = calls.get(callId);

  if (!call) {
    return null;
  }

  return commit(call, reduceDmCall({ call, event, now: Date.now() }));
};

const leaveOtherCalls = (userId: string) => {
  for (const call of callsOf(userId)) {
    if (isLive(call)) {
      dispatch(call.id, { type: 'hangup', userId });
    }
  }
};

export const acceptDmCall = (callId: string): DmCall | null => {
  const call = calls.get(callId);

  if (!call) {
    return null;
  }

  for (const other of callsOf(call.callee.id)) {
    if (other.id !== callId && other.state === 'active') {
      dispatch(other.id, { type: 'hangup', userId: call.callee.id });
    }
  }

  return dispatch(callId, { type: 'accept' });
};

export const startDmCall = (input: StartDmCallInput): DmCall => {
  const { caller, callee, roomId } = input;
  const now = Date.now();

  const existing = callsOf(caller.id).find((call) => isLive(call) && involves(call, callee.id));

  if (existing) {
    const isGlare = existing.state === 'ringing' && existing.callee.id === caller.id;

    return isGlare ? (acceptDmCall(existing.id) ?? existing) : existing;
  }

  leaveOtherCalls(caller.id);

  const call = createDmCall({ ...input, id: randomUUID(), now });
  const isCalleeRinging = callsOf(callee.id).some((other) => other.state === 'ringing');

  if (isCalleeRinging) {
    return commit(null, endDmCall({ call, reason: 'busy', now }));
  }

  commit(null, call);

  emitDomainEvent(DomainEvent.CallRinging, {
    callId: call.id,
    calleeId: callee.id,
    caller,
    roomId
  });

  return call;
};

export const declineDmCall = (callId: string): DmCall | null =>
  dispatch(callId, { type: 'decline' });

export const cancelDmCall = (callId: string): DmCall | null => dispatch(callId, { type: 'cancel' });

export const hangupDmCall = ({ callId, userId }: HangupDmCallInput): DmCall | null =>
  dispatch(callId, { type: 'hangup', userId });

export const ackLegacyCall = (callId: string): void => {
  const call = calls.get(callId);

  if (call && !call.legacyAcked) {
    commit(call, { ...call, legacyAcked: true });
  }
};

const liveCallInRoom = (roomId: string) =>
  [...calls.values()].find((call) => call.roomId === roomId && isLive(call));

export const onDmVoiceJoined = ({ roomId, userId }: DmCallVoiceInput): void => {
  const call = liveCallInRoom(roomId);

  if (call) {
    dispatch(call.id, { type: 'joined', userId });
  }
};

export const onDmVoiceLeft = ({ roomId, userId }: DmCallVoiceInput): void => {
  const call = liveCallInRoom(roomId);

  if (call) {
    dispatch(call.id, { type: 'left', userId });
  }
};

const dispatchToCallerOf = (userId: string, event: DmCallEvent) => {
  for (const call of callsOf(userId)) {
    if (call.state === 'ringing' && call.caller.id === userId) {
      dispatch(call.id, event);
    }
  }
};

export const onCallUserOnline = (userId: string): void => {
  dispatchToCallerOf(userId, { type: 'callerOnline' });
};

export const onCallUserOffline = (userId: string): void => {
  dispatchToCallerOf(userId, { type: 'callerOffline' });
};

export const endCallsBetween = ({ userId, otherUserId }: CallsBetweenInput): void => {
  for (const call of callsOf(userId)) {
    if (isLive(call) && involves(call, otherUserId)) {
      dispatch(call.id, { type: 'blocked' });
    }
  }
};

export const bumpFriendsEpoch = (...userIds: string[]): void => {
  for (const userId of new Set(userIds)) {
    friendsEpochByUser.set(userId, (friendsEpochByUser.get(userId) ?? 0) + 1);
    emitUser(userId);
  }
};

export const clearFriendsEpoch = (userId: string): void => {
  if (callsOf(userId).length > 0) {
    return;
  }

  friendsEpochByUser.delete(userId);
};
