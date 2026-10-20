import type { MusicTrack } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import { enqueueMusicTrack } from '../enqueue-music-track';

const track = (id: string): MusicTrack => ({
  id,
  source: 'soundcloud',
  ref: 'https://soundcloud.com/a/b',
  url: 'https://soundcloud.com/a/b',
  title: id,
  artist: null,
  artwork: null,
  addedBy: { id: 'user-1', name: 'Alex' }
});

const FIRST = track('00000000-0000-4000-8000-000000000001');
const SECOND = track('00000000-0000-4000-8000-000000000002');

describe('enqueueMusicTrack', () => {
  it('starts playing straight away in a silent room', () => {
    expect(
      enqueueMusicTrack({
        state: { current: null, playback: null, queue: [], history: [] },
        track: FIRST,
        now: 7_000
      })
    ).toEqual({
      current: FIRST,
      playback: { status: 'playing', startedAt: 7_000 },
      queue: [],
      history: []
    });
  });

  it('appends to the queue while something plays', () => {
    const playing = {
      current: FIRST,
      playback: { status: 'paused', positionMs: 3_000 } as const,
      queue: [],
      history: []
    };

    expect(enqueueMusicTrack({ state: playing, track: SECOND, now: 7_000 })).toEqual({
      ...playing,
      queue: [SECOND],
      history: []
    });
  });
});
