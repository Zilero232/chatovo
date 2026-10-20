'use client';

import { useRoomMusicActions } from '@/entities/room/music';

import { useRoomMusicContext } from '../contexts/room-music-context';

export const useCurrentRoomMusic = () => {
  const { roomId, music } = useRoomMusicContext();

  const actions = useRoomMusicActions(roomId);

  return { roomId, music, actions };
};
