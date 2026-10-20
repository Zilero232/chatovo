import type { MusicTrack, RoomMusic } from '@chatovo/schemas';

import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { QUERY_KEYS } from '@/shared/constants';

import type { RoomMusicView } from '../../../model/types';

import { writeRoomMusicCache } from '../write-room-music-cache';

const ROOM_ID = '00000000-0000-4000-8000-000000000001';

const TRACK: MusicTrack = {
  id: '00000000-0000-4000-8000-0000000000aa',
  source: 'radio',
  ref: 'https://stream.example.com/a.mp3',
  url: 'https://stream.example.com/a.mp3',
  title: 'Lofi',
  artist: null,
  artwork: null,
  addedBy: { id: 'user-1', name: 'Alex' }
};

const music = (revision: number, current: MusicTrack | null): RoomMusic => ({
  roomId: ROOM_ID,
  current,
  playback: current ? { status: 'playing', startedAt: 0 } : null,
  queue: [],
  revision,
  serverTime: 0
});

const readRoom = (queryClient: QueryClient) =>
  queryClient.getQueryData<RoomMusicView>(QUERY_KEYS.roomMusic(ROOM_ID));

describe('writeRoomMusicCache', () => {
  it('keeps the newer snapshot when an older one arrives late', () => {
    const queryClient = new QueryClient();

    writeRoomMusicCache({ queryClient, music: music(2, null) });
    writeRoomMusicCache({ queryClient, music: music(1, TRACK) });

    expect(readRoom(queryClient)?.revision).toBe(2);
    expect(readRoom(queryClient)?.current).toBeNull();
  });
});
