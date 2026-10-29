import { minutesToMilliseconds } from 'date-fns';
import { describe, expect, it } from 'vitest';

import type { VoiceSession, VoiceSessionEvent } from '../../../telegram.types';

import { applyVoiceEvent } from '../apply-voice-event';

const join = (participantId: string, participantName = participantId): VoiceSessionEvent => ({
  type: 'join',
  participantId,
  participantName,
  roomName: 'Test'
});

const leave = (participantId: string): VoiceSessionEvent => ({ type: 'leave', participantId });

const END: VoiceSessionEvent = { type: 'end' };

const play = (steps: [minute: number, event: VoiceSessionEvent][]): VoiceSession | null =>
  steps.reduce<VoiceSession | null>(
    (session, [minute, event]) =>
      applyVoiceEvent({ session, event, now: minutesToMilliseconds(minute) }),
    null
  );

describe('applyVoiceEvent', () => {
  it('starts a session on the first join', () => {
    expect(applyVoiceEvent({ session: null, event: join('a', 'Anna'), now: 1000 })).toEqual({
      attendees: [{ id: 'a', name: 'Anna', joinedAt: 1000, totalMs: 0 }],
      peakCount: 1,
      presentIds: ['a'],
      roomName: 'Test',
      startedAt: 1000
    });
  });

  it('ignores a leave or an end when no session is tracked', () => {
    expect(applyVoiceEvent({ session: null, event: leave('a'), now: 1000 })).toBeNull();
    expect(applyVoiceEvent({ session: null, event: END, now: 1000 })).toBeNull();
  });

  it('adds up the time of every stay across a rejoin', () => {
    const session = play([
      [0, join('a')],
      [10, leave('a')],
      [15, join('a', 'Anna renamed')],
      [45, leave('a')]
    ]);

    expect(session?.attendees).toEqual([
      { id: 'a', name: 'Anna renamed', joinedAt: null, totalMs: minutesToMilliseconds(40) }
    ]);
    expect(session?.startedAt).toBe(0);
  });

  it('keeps the highest headcount reached, not the current one', () => {
    const session = play([
      [0, join('a')],
      [1, join('b')],
      [2, join('c')],
      [3, leave('a')],
      [4, leave('b')]
    ]);

    expect(session?.presentIds).toEqual(['c']);
    expect(session?.peakCount).toBe(3);
  });

  it('does not double-count a join for someone already present', () => {
    const session = play([
      [0, join('a')],
      [5, join('a')],
      [10, leave('a')]
    ]);

    expect(session?.peakCount).toBe(1);
    expect(session?.attendees[0]?.totalMs).toBe(minutesToMilliseconds(10));
  });

  it('closes every open stay when the room ends without their leave', () => {
    const session = play([
      [0, join('a')],
      [5, join('b')],
      [20, END]
    ]);

    expect(session?.presentIds).toEqual([]);
    expect(session?.attendees.map((attendee) => attendee.totalMs)).toEqual([
      minutesToMilliseconds(20),
      minutesToMilliseconds(15)
    ]);
  });

  it('ignores a leave from someone it never saw join, such as an invisible admin', () => {
    const started = applyVoiceEvent({ session: null, event: join('a'), now: 0 });

    expect(applyVoiceEvent({ session: started, event: leave('ghost'), now: 1 })).toEqual(started);
  });
});
