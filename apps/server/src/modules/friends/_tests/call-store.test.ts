import type { FriendCallStreamSnapshot, FriendUser } from '@chatovo/schemas';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const emitFriendsSnapshot = vi.fn();
const emitDomainEvent = vi.fn();
const closeLivekitRoom = vi.fn();

vi.mock('../../realtime', () => ({
  emitFriendsSnapshot: (userId: string, snapshot: unknown) => emitFriendsSnapshot(userId, snapshot)
}));

vi.mock('../../livekit', () => ({
  closeLivekitRoom: (roomId: string) => closeLivekitRoom(roomId)
}));

vi.mock('../../../common/events/emit-domain-event', () => ({
  emitDomainEvent: (event: string, payload: unknown) => emitDomainEvent(event, payload)
}));

const { DM_CALL_TIMINGS } = await import('../config');
const store = await import('../call-store');

let counter = 0;

const userOf = (id: string): FriendUser => ({
  id,
  name: id,
  friendTag: id,
  avatarUrl: null,
  verified: false,
  developer: false,
  isOnline: true
});

const pairOf = () => {
  counter += 1;

  return { a: `ann-${counter}`, b: `bob-${counter}`, roomId: `room-${counter}` };
};

const ring = ({ a, b, roomId }: { a: string; b: string; roomId: string }) =>
  store.startDmCall({ roomId, caller: userOf(a), callee: userOf(b), calleeReachable: true });

const snapshotOf = (userId: string): FriendCallStreamSnapshot => store.getUserCallSnapshot(userId);

const endedEvents = () =>
  emitDomainEvent.mock.calls
    .filter(([event]) => event === 'call.ended')
    .map(([, payload]) => payload);

describe('call store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-29T12:00:00Z'));
    emitFriendsSnapshot.mockReset();
    emitDomainEvent.mockReset();
    closeLivekitRoom.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rings the callee and tells the caller it is calling', () => {
    const pair = pairOf();
    const call = ring(pair);

    expect(snapshotOf(pair.b).calls.incoming).toMatchObject({ id: call.id, direction: 'incoming' });
    expect(snapshotOf(pair.a).calls.current).toMatchObject({
      id: call.id,
      direction: 'outgoing',
      state: 'ringing'
    });
    expect(emitDomainEvent).toHaveBeenCalledWith('call.ringing', {
      callId: call.id,
      calleeId: pair.b,
      caller: userOf(pair.a),
      roomId: pair.roomId
    });
  });

  it('stops ringing by itself after the ring window and records a missed call', () => {
    const pair = pairOf();

    ring(pair);
    vi.advanceTimersByTime(DM_CALL_TIMINGS.ringMs);

    expect(snapshotOf(pair.b).calls.incoming).toBeNull();
    expect(snapshotOf(pair.a).calls.current).toMatchObject({
      state: 'ended',
      endReason: 'missed'
    });
    expect(endedEvents()).toEqual([expect.objectContaining({ outcome: 'missed' })]);
  });

  it('forgets an ended call once it has been shown', () => {
    const pair = pairOf();
    const call = ring(pair);

    store.declineDmCall(call.id);
    vi.advanceTimersByTime(DM_CALL_TIMINGS.endedVisibleMs);

    expect(store.findCall(call.id)).toBeNull();
    expect(snapshotOf(pair.a).calls.current).toBeNull();
  });

  it('connects two friends calling each other at once instead of ringing twice', () => {
    const pair = pairOf();
    const first = ring(pair);
    const second = store.startDmCall({
      roomId: pair.roomId,
      caller: userOf(pair.b),
      callee: userOf(pair.a),
      calleeReachable: true
    });

    expect(second.id).toBe(first.id);
    expect(second.state).toBe('active');
    expect(snapshotOf(pair.a).calls.incoming).toBeNull();
  });

  it('answers busy to a second caller while the callee is already being rung', () => {
    const pair = pairOf();

    ring(pair);

    const busy = store.startDmCall({
      roomId: 'room-other',
      caller: userOf('carl'),
      callee: userOf(pair.b),
      calleeReachable: true
    });

    expect(busy).toMatchObject({ state: 'ended', endReason: 'busy' });
    expect(snapshotOf(pair.b).calls.incoming?.peer.id).toBe(pair.a);
  });

  it('cancels the old ring when the caller calls somebody else', () => {
    const pair = pairOf();
    const first = ring(pair);

    store.startDmCall({
      roomId: 'room-third',
      caller: userOf(pair.a),
      callee: userOf('dora'),
      calleeReachable: true
    });

    expect(store.findCall(first.id)).toMatchObject({ state: 'ended', endReason: 'cancelled' });
    expect(snapshotOf(pair.b).calls.incoming).toBeNull();
  });

  it('marks the callee busy for the caller while the callee sits in another call', () => {
    const first = pairOf();
    const call = ring(first);

    store.acceptDmCall(call.id);

    const waiting = store.startDmCall({
      roomId: 'room-wait',
      caller: userOf('erin'),
      callee: userOf(first.b),
      calleeReachable: true
    });

    expect(store.toCallView(waiting, 'erin').peerBusy).toBe(true);
  });

  it('cancels the ring when the caller goes offline and does not come back', () => {
    const pair = pairOf();
    const call = ring(pair);

    store.onCallUserOffline(pair.a);
    vi.advanceTimersByTime(DM_CALL_TIMINGS.callerOfflineMs);

    expect(store.findCall(call.id)).toMatchObject({ state: 'ended', endReason: 'cancelled' });
  });

  it('ends the call for both when one side hangs up and closes the room', () => {
    const pair = pairOf();
    const call = ring(pair);

    store.onDmVoiceJoined({ roomId: pair.roomId, userId: pair.a });
    store.acceptDmCall(call.id);
    store.onDmVoiceJoined({ roomId: pair.roomId, userId: pair.b });
    vi.advanceTimersByTime(90_000);
    store.hangupDmCall({ callId: call.id, userId: pair.b });

    expect(snapshotOf(pair.a).calls.current).toMatchObject({
      state: 'ended',
      endReason: 'completed'
    });
    expect(endedEvents()).toEqual([
      expect.objectContaining({ outcome: 'completed', durationSec: 90 })
    ]);
    expect(closeLivekitRoom).toHaveBeenCalledWith(pair.roomId);
  });

  it('keeps the call through a short drop and ends it after the grace', () => {
    const pair = pairOf();
    const call = ring(pair);

    store.onDmVoiceJoined({ roomId: pair.roomId, userId: pair.a });
    store.onDmVoiceJoined({ roomId: pair.roomId, userId: pair.b });
    store.onDmVoiceLeft({ roomId: pair.roomId, userId: pair.b });

    expect(snapshotOf(pair.a).calls.current?.peerGraceEndsAt).not.toBeNull();

    store.onDmVoiceJoined({ roomId: pair.roomId, userId: pair.b });
    store.onDmVoiceLeft({ roomId: pair.roomId, userId: pair.b });
    vi.advanceTimersByTime(DM_CALL_TIMINGS.peerDropGraceMs - 1);

    expect(store.findCall(call.id)?.state).toBe('active');

    vi.advanceTimersByTime(1);

    expect(store.findCall(call.id)).toMatchObject({ state: 'ended', endReason: 'completed' });
  });

  it('ends a call between people who stop being friends without logging it', () => {
    const pair = pairOf();
    const call = ring(pair);

    store.endCallsBetween({ userId: pair.b, otherUserId: pair.a });

    expect(store.findCall(call.id)).toMatchObject({ state: 'ended', endReason: 'blocked' });
  });

  it('keeps the legacy fields an older installed app reads', () => {
    const pair = pairOf();
    const call = ring(pair);

    expect(snapshotOf(pair.b).incoming).toEqual({ roomId: pair.roomId, caller: userOf(pair.a) });
    expect(snapshotOf(pair.a).outgoing?.status).toBe('ringing');

    store.acceptDmCall(call.id);

    expect(snapshotOf(pair.a).outgoing?.status).toBe('accepted');

    store.ackLegacyCall(call.id);

    expect(snapshotOf(pair.a).outgoing).toBeNull();
  });
});
