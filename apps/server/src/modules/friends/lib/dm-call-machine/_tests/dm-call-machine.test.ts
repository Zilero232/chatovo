import type { FriendUser } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import type { DmCall, DmCallEvent } from '../../../friends.types';

import { DM_CALL_TIMINGS } from '../../../config';
import {
  createDmCall,
  dmCallDurationSec,
  isDmCallExpired,
  nextDmCallDeadline,
  reduceDmCall
} from '../dm-call-machine';

const userOf = (id: string): FriendUser => ({
  id,
  name: id,
  friendTag: id,
  avatarUrl: null,
  verified: false,
  developer: false,
  isOnline: true
});

const T0 = 1_000_000;

const ringing = (): DmCall =>
  createDmCall({
    id: 'call-1',
    roomId: 'room-1',
    caller: userOf('ann'),
    callee: userOf('bob'),
    calleeReachable: true,
    now: T0
  });

const apply = (call: DmCall, steps: [DmCallEvent, number][]) =>
  steps.reduce((current, [event, now]) => reduceDmCall({ call: current, event, now }), call);

const inCall = (): DmCall =>
  apply(ringing(), [
    [{ type: 'joined', userId: 'ann' }, T0 + 100],
    [{ type: 'accept' }, T0 + 2_000],
    [{ type: 'joined', userId: 'bob' }, T0 + 3_000]
  ]);

describe('reduceDmCall', () => {
  it('becomes active when the callee accepts', () => {
    const call = reduceDmCall({ call: ringing(), event: { type: 'accept' }, now: T0 + 2_000 });

    expect(call.state).toBe('active');
    expect(call.answeredAt).toBe(T0 + 2_000);
    expect(call.ringEndsAt).toBeNull();
  });

  it('treats the callee joining the room while it rings as an answer', () => {
    const call = reduceDmCall({
      call: ringing(),
      event: { type: 'joined', userId: 'bob' },
      now: T0 + 1_000
    });

    expect(call.state).toBe('active');
  });

  it('ends as missed once nobody answers within the ring window', () => {
    const call = reduceDmCall({
      call: ringing(),
      event: { type: 'tick' },
      now: T0 + DM_CALL_TIMINGS.ringMs
    });

    expect(call).toMatchObject({ state: 'ended', endReason: 'missed' });
  });

  it('keeps ringing on a tick that comes early', () => {
    expect(reduceDmCall({ call: ringing(), event: { type: 'tick' }, now: T0 + 1_000 }).state).toBe(
      'ringing'
    );
  });

  it('cancels the ring when the caller stays offline past the grace', () => {
    const call = apply(ringing(), [
      [{ type: 'callerOffline' }, T0 + 1_000],
      [{ type: 'tick' }, T0 + 1_000 + DM_CALL_TIMINGS.callerOfflineMs]
    ]);

    expect(call).toMatchObject({ state: 'ended', endReason: 'cancelled' });
  });

  it('keeps ringing when the caller comes back online in time', () => {
    const call = apply(ringing(), [
      [{ type: 'callerOffline' }, T0 + 1_000],
      [{ type: 'callerOnline' }, T0 + 5_000],
      [{ type: 'tick' }, T0 + 1_000 + DM_CALL_TIMINGS.callerOfflineMs]
    ]);

    expect(call.state).toBe('ringing');
  });

  it('ignores the caller going offline while they already sit in the call room', () => {
    const call = apply(ringing(), [
      [{ type: 'joined', userId: 'ann' }, T0 + 100],
      [{ type: 'callerOffline' }, T0 + 1_000]
    ]);

    expect(call.callerOfflineSince).toBeNull();
  });

  it('names a hang-up while ringing after the side that pressed it', () => {
    expect(
      reduceDmCall({ call: ringing(), event: { type: 'hangup', userId: 'ann' }, now: T0 }).endReason
    ).toBe('cancelled');
    expect(
      reduceDmCall({ call: ringing(), event: { type: 'hangup', userId: 'bob' }, now: T0 }).endReason
    ).toBe('declined');
  });

  it('ends an active call for both on a hang-up', () => {
    const call = reduceDmCall({
      call: inCall(),
      event: { type: 'hangup', userId: 'bob' },
      now: T0 + 60_000
    });

    expect(call).toMatchObject({ state: 'ended', endReason: 'completed', endedAt: T0 + 60_000 });
  });

  it('starts the reconnect grace when a participant drops without hanging up', () => {
    const call = reduceDmCall({
      call: inCall(),
      event: { type: 'left', userId: 'bob' },
      now: T0 + 10_000
    });

    expect(call.state).toBe('active');
    expect(call.graceEndsAt).toBe(T0 + 10_000 + DM_CALL_TIMINGS.peerDropGraceMs);
  });

  it('clears the grace when the dropped participant returns', () => {
    const call = apply(inCall(), [
      [{ type: 'left', userId: 'bob' }, T0 + 10_000],
      [{ type: 'joined', userId: 'bob' }, T0 + 20_000]
    ]);

    expect(call.graceEndsAt).toBeNull();
    expect(call.inCall).toEqual(['ann', 'bob']);
  });

  it('ends the call once the grace runs out', () => {
    const call = apply(inCall(), [
      [{ type: 'left', userId: 'bob' }, T0 + 10_000],
      [{ type: 'tick' }, T0 + 10_000 + DM_CALL_TIMINGS.peerDropGraceMs]
    ]);

    expect(call).toMatchObject({ state: 'ended', endReason: 'completed' });
  });

  it('keeps the first grace deadline when the second participant also drops', () => {
    const call = apply(inCall(), [
      [{ type: 'left', userId: 'bob' }, T0 + 10_000],
      [{ type: 'left', userId: 'ann' }, T0 + 30_000]
    ]);

    expect(call.graceEndsAt).toBe(T0 + 10_000 + DM_CALL_TIMINGS.peerDropGraceMs);
  });

  it('fails an answered call that one side never joins', () => {
    const call = apply(ringing(), [
      [{ type: 'joined', userId: 'ann' }, T0 + 100],
      [{ type: 'accept' }, T0 + 2_000],
      [{ type: 'tick' }, T0 + 2_000 + DM_CALL_TIMINGS.joinMs]
    ]);

    expect(call).toMatchObject({ state: 'ended', endReason: 'failed' });
  });

  it('never revives an ended call', () => {
    const ended = reduceDmCall({ call: ringing(), event: { type: 'decline' }, now: T0 + 1 });

    expect(reduceDmCall({ call: ended, event: { type: 'accept' }, now: T0 + 2 })).toBe(ended);
    expect(
      reduceDmCall({ call: ended, event: { type: 'joined', userId: 'bob' }, now: T0 + 2 })
    ).toBe(ended);
  });

  it('ignores a stranger joining the DM room', () => {
    const call = ringing();

    expect(reduceDmCall({ call, event: { type: 'joined', userId: 'eve' }, now: T0 })).toBe(call);
  });
});

describe('nextDmCallDeadline', () => {
  it('waits for the ring to run out', () => {
    expect(nextDmCallDeadline(ringing())).toBe(T0 + DM_CALL_TIMINGS.ringMs);
  });

  it('has nothing pending for a call both sides sit in', () => {
    expect(nextDmCallDeadline(inCall())).toBeNull();
  });

  it('expires an ended call after it has been shown', () => {
    const ended = reduceDmCall({ call: ringing(), event: { type: 'decline' }, now: T0 + 1 });

    expect(nextDmCallDeadline(ended)).toBe(T0 + 1 + DM_CALL_TIMINGS.endedVisibleMs);
    expect(isDmCallExpired({ call: ended, now: T0 + 1 + DM_CALL_TIMINGS.endedVisibleMs })).toBe(
      true
    );
  });
});

describe('dmCallDurationSec', () => {
  it('counts from the answer, not from the first ring', () => {
    const ended = reduceDmCall({
      call: inCall(),
      event: { type: 'hangup', userId: 'ann' },
      now: T0 + 2_000 + 754_000
    });

    expect(dmCallDurationSec(ended)).toBe(754);
  });

  it('has no duration for a call nobody answered', () => {
    const ended = reduceDmCall({ call: ringing(), event: { type: 'decline' }, now: T0 + 1 });

    expect(dmCallDurationSec(ended)).toBeNull();
  });
});
