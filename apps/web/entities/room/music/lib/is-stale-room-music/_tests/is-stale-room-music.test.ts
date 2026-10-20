import type { RoomMusic } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import { isStaleRoomMusic } from '../is-stale-room-music';

const music = (revision: number): RoomMusic => ({
  roomId: '00000000-0000-4000-8000-000000000001',
  current: null,
  playback: null,
  queue: [],
  revision,
  serverTime: 0
});

describe('isStaleRoomMusic', () => {
  it('accepts the first snapshot of a room', () => {
    expect(isStaleRoomMusic({ cached: undefined, music: music(5) })).toBe(false);
  });

  it('rejects a snapshot older than the cached one', () => {
    expect(isStaleRoomMusic({ cached: { ...music(7), clockOffsetMs: 0 }, music: music(6) })).toBe(
      true
    );
  });

  it('accepts a snapshot of the same revision, which only refreshes the clock', () => {
    expect(isStaleRoomMusic({ cached: { ...music(7), clockOffsetMs: 0 }, music: music(7) })).toBe(
      false
    );
  });
});
