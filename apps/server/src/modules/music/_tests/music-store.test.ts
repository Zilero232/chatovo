import type { MusicTrack } from '@chatovo/schemas';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { RoomMusicState } from '../music.types';

import { EMPTY_ROOM_MUSIC } from '../config';
import {
  listMusicRoomIds,
  readRoomMusic,
  readRoomMusicRevision,
  writeRoomMusic
} from '../music-store';

const TRACK: MusicTrack = {
  id: '00000000-0000-4000-8000-000000000001',
  source: 'youtube',
  ref: 'dQw4w9WgXcQ',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Track',
  artist: null,
  artwork: null,
  addedBy: { id: 'user-1', name: 'Alex' }
};

const PLAYING: RoomMusicState = {
  current: TRACK,
  playback: { status: 'playing', startedAt: 0 },
  queue: [],
  history: []
};

describe('music store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('gives each write a larger revision even within the same millisecond', () => {
    writeRoomMusic({ roomId: 'room-a', state: PLAYING });
    const first = readRoomMusicRevision('room-a');

    writeRoomMusic({ roomId: 'room-a', state: { ...PLAYING, queue: [TRACK] } });

    expect(readRoomMusicRevision('room-a')).toBeGreaterThan(first);
  });

  it('forgets a room once it has nothing to play', () => {
    writeRoomMusic({ roomId: 'room-b', state: PLAYING });
    writeRoomMusic({ roomId: 'room-b', state: EMPTY_ROOM_MUSIC });

    expect(readRoomMusic('room-b')).toBe(EMPTY_ROOM_MUSIC);
    expect(listMusicRoomIds()).not.toContain('room-b');
  });

  it('reports an emptied room at a revision no older than its last write', () => {
    writeRoomMusic({ roomId: 'room-c', state: PLAYING });
    const playingRevision = readRoomMusicRevision('room-c');

    writeRoomMusic({ roomId: 'room-c', state: EMPTY_ROOM_MUSIC });

    expect(readRoomMusicRevision('room-c')).toBeGreaterThan(playingRevision);
  });
});
