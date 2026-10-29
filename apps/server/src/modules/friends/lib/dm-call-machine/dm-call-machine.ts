import { match } from 'ts-pattern';

import type { DmCall } from '../../friends.types';
import type {
  CreateDmCallInput,
  DmCallClockInput,
  DmCallUserClockInput,
  EndDmCallInput,
  ReduceDmCallInput
} from './dm-call-machine.types';

import { DM_CALL_TIMINGS } from '../../config';

const withoutUser = (ids: string[], userId: string) => ids.filter((id) => id !== userId);

const withUser = (ids: string[], userId: string) => (ids.includes(userId) ? ids : [...ids, userId]);

const participantIds = (call: DmCall) => [call.caller.id, call.callee.id];

const isParticipant = (call: DmCall, userId: string) => participantIds(call).includes(userId);

const hasBoth = (ids: string[], call: DmCall) =>
  participantIds(call).every((userId) => ids.includes(userId));

export const createDmCall = ({
  id,
  roomId,
  caller,
  callee,
  calleeReachable,
  now
}: CreateDmCallInput): DmCall => ({
  id,
  roomId,
  caller,
  callee,
  calleeReachable,
  state: 'ringing',
  startedAt: now,
  ringEndsAt: now + DM_CALL_TIMINGS.ringMs,
  answeredAt: null,
  endedAt: null,
  endReason: null,
  inCall: [],
  everJoined: [],
  graceEndsAt: null,
  callerOfflineSince: null,
  legacyAcked: false
});

export const endDmCall = ({ call, reason, now }: EndDmCallInput): DmCall => {
  if (call.state === 'ended') {
    return call;
  }

  return {
    ...call,
    state: 'ended',
    endReason: reason,
    endedAt: now,
    ringEndsAt: null,
    graceEndsAt: null,
    callerOfflineSince: null
  };
};

const answer = ({ call, now }: DmCallClockInput): DmCall => {
  if (call.state !== 'ringing') {
    return call;
  }

  return { ...call, state: 'active', answeredAt: now, ringEndsAt: null, callerOfflineSince: null };
};

const tickRinging = ({ call, now }: DmCallClockInput): DmCall => {
  const { callerOfflineSince, ringEndsAt } = call;

  if (callerOfflineSince !== null && now >= callerOfflineSince + DM_CALL_TIMINGS.callerOfflineMs) {
    return endDmCall({ call, reason: 'cancelled', now });
  }

  if (ringEndsAt !== null && now >= ringEndsAt) {
    return endDmCall({ call, reason: 'missed', now });
  }

  return call;
};

const tickActive = ({ call, now }: DmCallClockInput): DmCall => {
  const { graceEndsAt, answeredAt, everJoined } = call;

  if (graceEndsAt !== null && now >= graceEndsAt) {
    return endDmCall({ call, reason: 'completed', now });
  }

  const isJoinOverdue =
    !hasBoth(everJoined, call) && answeredAt !== null && now >= answeredAt + DM_CALL_TIMINGS.joinMs;

  if (isJoinOverdue) {
    return endDmCall({ call, reason: 'failed', now });
  }

  return call;
};

const join = ({ call, userId, now }: DmCallUserClockInput): DmCall => {
  if (call.state === 'ended' || !isParticipant(call, userId)) {
    return call;
  }

  const inCall = withUser(call.inCall, userId);
  const joined = { ...call, inCall, everJoined: withUser(call.everJoined, userId) };

  if (call.state === 'ringing') {
    return userId === call.callee.id
      ? answer({ call: joined, now })
      : { ...joined, callerOfflineSince: null };
  }

  return { ...joined, graceEndsAt: hasBoth(inCall, call) ? null : call.graceEndsAt };
};

const leave = ({ call, userId, now }: DmCallUserClockInput): DmCall => {
  if (call.state === 'ended' || !call.inCall.includes(userId)) {
    return call;
  }

  const inCall = withoutUser(call.inCall, userId);

  if (call.state === 'ringing') {
    return { ...call, inCall };
  }

  return {
    ...call,
    inCall,
    graceEndsAt: call.graceEndsAt ?? now + DM_CALL_TIMINGS.peerDropGraceMs
  };
};

const hangup = ({ call, userId, now }: DmCallUserClockInput): DmCall =>
  match(call.state)
    .with('ringing', () =>
      endDmCall({ call, reason: userId === call.caller.id ? 'cancelled' : 'declined', now })
    )
    .with('active', () => endDmCall({ call, reason: 'completed', now }))
    .with('ended', () => call)
    .exhaustive();

const tick = ({ call, now }: DmCallClockInput): DmCall =>
  match(call.state)
    .with('ringing', () => tickRinging({ call, now }))
    .with('active', () => tickActive({ call, now }))
    .with('ended', () => call)
    .exhaustive();

const markCallerOffline = (call: DmCall, now: number): DmCall => {
  if (call.state !== 'ringing' || call.inCall.includes(call.caller.id)) {
    return call;
  }

  return { ...call, callerOfflineSince: call.callerOfflineSince ?? now };
};

const endWhileRinging = ({ call, reason, now }: EndDmCallInput): DmCall =>
  call.state === 'ringing' ? endDmCall({ call, reason, now }) : call;

/** The next DM call state for one event; timers arrive as `tick` and are judged against `now`. */
export const reduceDmCall = ({ call, event, now }: ReduceDmCallInput): DmCall =>
  match(event)
    .with({ type: 'accept' }, () => answer({ call, now }))
    .with({ type: 'decline' }, () => endWhileRinging({ call, reason: 'declined', now }))
    .with({ type: 'cancel' }, () => endWhileRinging({ call, reason: 'cancelled', now }))
    .with({ type: 'hangup' }, ({ userId }) => hangup({ call, userId, now }))
    .with({ type: 'blocked' }, () => endDmCall({ call, reason: 'blocked', now }))
    .with({ type: 'callerOffline' }, () => markCallerOffline(call, now))
    .with({ type: 'callerOnline' }, () => ({ ...call, callerOfflineSince: null }))
    .with({ type: 'joined' }, ({ userId }) => join({ call, userId, now }))
    .with({ type: 'left' }, ({ userId }) => leave({ call, userId, now }))
    .with({ type: 'tick' }, () => tick({ call, now }))
    .exhaustive();

const ringingDeadline = (call: DmCall): number => {
  const offlineDeadline =
    call.callerOfflineSince === null
      ? Infinity
      : call.callerOfflineSince + DM_CALL_TIMINGS.callerOfflineMs;

  return Math.min(call.ringEndsAt ?? Infinity, offlineDeadline);
};

const activeDeadline = (call: DmCall): number => {
  const joinDeadline =
    hasBoth(call.everJoined, call) || call.answeredAt === null
      ? Infinity
      : call.answeredAt + DM_CALL_TIMINGS.joinMs;

  return Math.min(call.graceEndsAt ?? Infinity, joinDeadline);
};

/** When the call next needs a `tick`, or null when nothing is pending; an ended call expires then. */
export const nextDmCallDeadline = (call: DmCall): number | null => {
  const deadline = match(call.state)
    .with('ringing', () => ringingDeadline(call))
    .with('active', () => activeDeadline(call))
    .with('ended', () => (call.endedAt ?? 0) + DM_CALL_TIMINGS.endedVisibleMs)
    .exhaustive();

  return Number.isFinite(deadline) ? deadline : null;
};

export const isDmCallExpired = ({ call, now }: DmCallClockInput): boolean =>
  call.state === 'ended' && now >= (call.endedAt ?? 0) + DM_CALL_TIMINGS.endedVisibleMs;

/** Seconds between answer and end, or null for a call nobody answered. */
export const dmCallDurationSec = (call: DmCall): number | null => {
  const { answeredAt, endedAt } = call;

  if (answeredAt === null || endedAt === null) {
    return null;
  }

  return Math.max(0, Math.round((endedAt - answeredAt) / 1000));
};
