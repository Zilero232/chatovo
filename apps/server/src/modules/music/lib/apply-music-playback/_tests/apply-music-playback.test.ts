import type { MusicTrack } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import type { RoomMusicState } from '../../../music.types';

import { applyMusicPlayback } from '../apply-music-playback';

const track = (id: string, source: MusicTrack['source'] = 'youtube'): MusicTrack => ({
  id,
  source,
  ref: 'dQw4w9WgXcQ',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: `Track ${id}`,
  artist: null,
  artwork: null,
  addedBy: { id: 'user-1', name: 'Alex' }
});

const FIRST = track('00000000-0000-4000-8000-000000000001');
const SECOND = track('00000000-0000-4000-8000-000000000002');
const RADIO = track('00000000-0000-4000-8000-000000000003', 'radio');

const PLAYING: RoomMusicState = {
  current: FIRST,
  playback: { status: 'playing', startedAt: 1_000 },
  queue: [SECOND],
  history: []
};

const PAUSED: RoomMusicState = {
  current: FIRST,
  playback: { status: 'paused', positionMs: 30_000 },
  queue: [SECOND],
  history: []
};

describe('applyMusicPlayback', () => {
  it('does nothing when no track is playing', () => {
    expect(
      applyMusicPlayback({
        state: { current: null, playback: null, queue: [], history: [] },
        command: { action: 'play' },
        now: 5_000
      })
    ).toBeNull();
  });

  it('pauses at the position reached so far', () => {
    expect(
      applyMusicPlayback({ state: PLAYING, command: { action: 'pause' }, now: 11_000 })
    ).toEqual({
      ...PLAYING,
      playback: { status: 'paused', positionMs: 10_000 }
    });
  });

  it('resumes from the paused position', () => {
    expect(
      applyMusicPlayback({ state: PAUSED, command: { action: 'play' }, now: 100_000 })
    ).toEqual({
      ...PAUSED,
      playback: { status: 'playing', startedAt: 70_000 }
    });
  });

  it('resumes live radio at the live edge instead of the old position', () => {
    const state: RoomMusicState = { ...PAUSED, current: RADIO };

    expect(
      applyMusicPlayback({ state, command: { action: 'play' }, now: 100_000 })?.playback
    ).toEqual({ status: 'playing', startedAt: 100_000 });
  });

  it('ignores a repeated play or pause', () => {
    expect(
      applyMusicPlayback({ state: PLAYING, command: { action: 'play' }, now: 2_000 })
    ).toBeNull();
    expect(
      applyMusicPlayback({ state: PAUSED, command: { action: 'pause' }, now: 2_000 })
    ).toBeNull();
  });

  it('seeks a playing track by moving its start', () => {
    expect(
      applyMusicPlayback({
        state: PLAYING,
        command: { action: 'seek', positionMs: 45_000 },
        now: 50_000
      })?.playback
    ).toEqual({ status: 'playing', startedAt: 5_000 });
  });

  it('seeks a paused track without starting it', () => {
    expect(
      applyMusicPlayback({ state: PAUSED, command: { action: 'seek', positionMs: 0 }, now: 50_000 })
        ?.playback
    ).toEqual({ status: 'paused', positionMs: 0 });
  });

  it('refuses to seek live radio', () => {
    const state: RoomMusicState = { ...PLAYING, current: RADIO };

    expect(
      applyMusicPlayback({ state, command: { action: 'seek', positionMs: 5_000 }, now: 9_000 })
    ).toBeNull();
  });

  it('moves to the next queued track when the current one is named', () => {
    expect(
      applyMusicPlayback({
        state: PLAYING,
        command: { action: 'next', trackId: FIRST.id },
        now: 9_000
      })
    ).toEqual({
      current: SECOND,
      playback: { status: 'playing', startedAt: 9_000 },
      queue: [],
      history: [FIRST]
    });
  });

  it('ignores a next for a track that is no longer current', () => {
    expect(
      applyMusicPlayback({
        state: PLAYING,
        command: { action: 'next', trackId: SECOND.id },
        now: 9_000
      })
    ).toBeNull();
  });

  it('empties the room when the last track ends', () => {
    expect(
      applyMusicPlayback({
        state: { ...PLAYING, queue: [] },
        command: { action: 'next', trackId: FIRST.id },
        now: 9_000
      })
    ).toEqual({ current: null, playback: null, queue: [], history: [FIRST] });
  });

  it('goes back to the previous track early in the current one', () => {
    expect(
      applyMusicPlayback({
        state: { ...PLAYING, history: [SECOND] },
        command: { action: 'previous' },
        now: 2_000
      })
    ).toEqual({
      current: SECOND,
      playback: { status: 'playing', startedAt: 2_000 },
      queue: [FIRST, SECOND],
      history: []
    });
  });

  it('restarts the current track once it has played for a while', () => {
    expect(
      applyMusicPlayback({
        state: { ...PLAYING, history: [SECOND] },
        command: { action: 'previous' },
        now: 60_000
      })?.playback
    ).toEqual({ status: 'playing', startedAt: 60_000 });
  });

  it('restarts the current track when there is nothing to go back to', () => {
    expect(
      applyMusicPlayback({ state: PAUSED, command: { action: 'previous' }, now: 2_000 })?.playback
    ).toEqual({ status: 'paused', positionMs: 0 });
  });

  it('ignores previous on live radio with no history', () => {
    expect(
      applyMusicPlayback({
        state: { ...PLAYING, current: RADIO },
        command: { action: 'previous' },
        now: 60_000
      })
    ).toBeNull();
  });

  it('clears the current track and the queue on stop', () => {
    expect(applyMusicPlayback({ state: PLAYING, command: { action: 'stop' }, now: 9_000 })).toEqual(
      {
        current: null,
        playback: null,
        queue: [],
        history: []
      }
    );
  });
});
