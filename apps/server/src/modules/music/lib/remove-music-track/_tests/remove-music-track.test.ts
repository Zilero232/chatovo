import type { MusicTrack } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import type { RoomMusicState } from '../../../music.types';

import { removeMusicTrack } from '../remove-music-track';

const track = (id: string): MusicTrack => ({
  id,
  source: 'youtube',
  ref: 'dQw4w9WgXcQ',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: id,
  artist: null,
  artwork: null,
  addedBy: { id: 'user-1', name: 'Alex' }
});

const FIRST = track('00000000-0000-4000-8000-000000000001');
const SECOND = track('00000000-0000-4000-8000-000000000002');
const THIRD = track('00000000-0000-4000-8000-000000000003');

const STATE: RoomMusicState = {
  current: FIRST,
  playback: { status: 'playing', startedAt: 0 },
  queue: [SECOND, THIRD],
  history: []
};

describe('removeMusicTrack', () => {
  it('drops a queued track and keeps the rest in order', () => {
    expect(removeMusicTrack({ state: STATE, trackId: SECOND.id, now: 5_000 })).toEqual({
      ...STATE,
      queue: [THIRD],
      history: []
    });
  });

  it('skips to the next track when the current one is removed', () => {
    expect(removeMusicTrack({ state: STATE, trackId: FIRST.id, now: 5_000 })).toEqual({
      current: SECOND,
      playback: { status: 'playing', startedAt: 5_000 },
      queue: [THIRD],
      history: []
    });
  });

  it('returns null for an unknown track', () => {
    expect(
      removeMusicTrack({
        state: STATE,
        trackId: '00000000-0000-4000-8000-000000000009',
        now: 5_000
      })
    ).toBeNull();
  });
});
