'use client';

import { useRoomMusicContext } from '../contexts/room-music-context';

export const useIsRoomMusicActive = () => {
  const { isMusicActive } = useRoomMusicContext();

  return isMusicActive;
};
