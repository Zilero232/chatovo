import { minutesToMilliseconds } from 'date-fns';
import { describe, expect, it } from 'vitest';

import type { VoiceRoomSnapshot, VoiceSession } from '../../../telegram.types';

import { VOICE_MAX_LISTED_NAMES } from '../../../config';
import { formatVoiceSession } from '../format-voice-session';

const URL = 'https://app.chatovo.ru/room?id=room-1';

const EMPTY_SNAPSHOT: VoiceRoomSnapshot = { presence: {}, track: null };

const LIVE_SESSION: VoiceSession = {
  attendees: [
    { id: 'a', name: 'Alexandr Artemev', joinedAt: 0, totalMs: 0 },
    { id: 'p', name: 'Pivozavrik', joinedAt: 0, totalMs: 0 },
    { id: 'r', name: 'rnd', joinedAt: null, totalMs: minutesToMilliseconds(3) }
  ],
  peakCount: 3,
  presentIds: ['a', 'p'],
  roomName: 'Test',
  startedAt: 0
};

const ENDED_SESSION: VoiceSession = {
  ...LIVE_SESSION,
  attendees: [
    { id: 'a', name: 'Alexandr Artemev', joinedAt: null, totalMs: minutesToMilliseconds(12) },
    { id: 'p', name: 'Pivozavrik', joinedAt: null, totalMs: minutesToMilliseconds(62) },
    { id: 'r', name: 'rnd', joinedAt: null, totalMs: 20_000 }
  ],
  presentIds: []
};

const live = (overrides: { now?: number; snapshot?: VoiceRoomSnapshot; session?: VoiceSession }) =>
  formatVoiceSession({
    session: overrides.session ?? LIVE_SESSION,
    snapshot: overrides.snapshot ?? EMPTY_SNAPSHOT,
    url: URL,
    now: overrides.now ?? 0,
    isOver: false
  });

describe('formatVoiceSession', () => {
  it('lists who is in the channel right now, one per line', () => {
    expect(live({}).text).toBe(
      '🔊 Голосовой канал Test · только начали\nСейчас в канале (2):\n• Alexandr Artemev\n• Pivozavrik'
    );
  });

  it('links and bolds the room name', () => {
    const message = live({});
    const offset = message.text.indexOf('Test');

    expect(message.entities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'text_link', url: URL, offset, length: 4 }),
        expect.objectContaining({ type: 'bold', offset, length: 4 })
      ])
    );
  });

  it('rounds the running time down to five-minute steps so the clock alone rarely edits', () => {
    expect(live({ now: minutesToMilliseconds(4) }).text).toContain('· только начали');
    expect(live({ now: minutesToMilliseconds(14) }).text).toContain('· идёт 10 минут');
    expect(live({ now: minutesToMilliseconds(67) }).text).toContain('· идёт 1 час 5 минут');
  });

  it('marks a muted mic, a deafened person and a shared game', () => {
    const message = live({
      snapshot: {
        presence: {
          a: { micMuted: false, deafened: false, activity: 'Dota 2' },
          p: { micMuted: true, deafened: true, activity: null }
        },
        track: null
      }
    });

    expect(message.text).toContain('• Alexandr Artemev · 🎮 Dota 2\n• Pivozavrik · 🔕');
  });

  it('shows a muted mic without a game', () => {
    const message = live({
      snapshot: {
        presence: { a: { micMuted: true, deafened: false, activity: null } },
        track: null
      }
    });

    expect(message.text).toContain('• Alexandr Artemev · 🔇');
  });

  it('adds the track playing in the room', () => {
    expect(
      live({ snapshot: { presence: {}, track: { artist: 'Daft Punk', title: 'Veridis Quo' } } })
        .text
    ).toMatch(/\n🎵 Daft Punk — Veridis Quo$/);
    expect(
      live({ snapshot: { presence: {}, track: { artist: null, title: 'Lo-fi radio' } } }).text
    ).toMatch(/\n🎵 Lo-fi radio$/);
  });

  it('says the channel is empty while it waits to close', () => {
    expect(live({ session: { ...LIVE_SESSION, presentIds: [] } }).text).toBe(
      '🔊 Голосовой канал Test · только начали\nСейчас в канале никого'
    );
  });

  it('sums up a finished session with its length, peak and everyone by time spent', () => {
    const message = formatVoiceSession({
      session: ENDED_SESSION,
      snapshot: EMPTY_SNAPSHOT,
      url: URL,
      now: minutesToMilliseconds(62),
      isOver: true
    });

    expect(message.text).toBe(
      [
        '🔇 Голосовой канал Test опустел · 1 час 2 минуты',
        'Максимум одновременно: 3',
        'Были (3):',
        '• Pivozavrik — 1 час 2 минуты',
        '• Alexandr Artemev — 12 минут',
        '• rnd — меньше минуты'
      ].join('\n')
    );
  });

  it('cuts a long list and counts the rest', () => {
    const attendees = Array.from({ length: VOICE_MAX_LISTED_NAMES + 3 }, (_, index) => ({
      id: `u${index}`,
      name: `u${index}`,
      joinedAt: null,
      totalMs: 0
    }));

    const message = formatVoiceSession({
      session: { ...ENDED_SESSION, attendees },
      snapshot: EMPTY_SNAPSHOT,
      url: URL,
      now: 0,
      isOver: true
    });

    expect(message.text.endsWith('\nи ещё 3')).toBe(true);
  });
});
