import { describe, expect, it } from 'vitest';

import { toRoomMusicView } from '../to-room-music-view';

const MUSIC = {
  roomId: '00000000-0000-4000-8000-000000000001',
  current: null,
  playback: null,
  queue: [],
  revision: 0,
  serverTime: 105_000
};

describe('toRoomMusicView', () => {
  it('records how far the server clock is ahead of the local one', () => {
    expect(toRoomMusicView({ music: MUSIC, receivedAt: 100_000 }).clockOffsetMs).toBe(5_000);
  });

  it('records a negative offset when the server is behind', () => {
    expect(toRoomMusicView({ music: MUSIC, receivedAt: 107_500 }).clockOffsetMs).toBe(-2_500);
  });
});
