import { describe, expect, it } from 'vitest';

import type { RoomMusicView } from '../../../model/types';

import { getExpectedPositionMs } from '../get-expected-position';

const ROOM_ID = '00000000-0000-4000-8000-000000000001';

const view = (patch: Partial<RoomMusicView>): RoomMusicView => ({
  roomId: ROOM_ID,
  current: null,
  playback: null,
  queue: [],
  revision: 0,
  serverTime: 0,
  clockOffsetMs: 0,
  ...patch
});

describe('getExpectedPositionMs', () => {
  it('is zero when nothing plays', () => {
    expect(getExpectedPositionMs({ music: view({}), now: 50_000 })).toBe(0);
  });

  it('corrects the local clock by the server offset', () => {
    const music = view({
      playback: { status: 'playing', startedAt: 10_000 },
      clockOffsetMs: 2_000
    });

    expect(getExpectedPositionMs({ music, now: 18_000 })).toBe(10_000);
  });

  it('keeps the paused position whatever the clock says', () => {
    const music = view({
      playback: { status: 'paused', positionMs: 4_000 },
      clockOffsetMs: -9_000
    });

    expect(getExpectedPositionMs({ music, now: 99_000 })).toBe(4_000);
  });
});
