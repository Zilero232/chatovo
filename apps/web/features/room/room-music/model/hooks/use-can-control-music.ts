'use client';

import { useRoomMusicContext } from '../contexts/room-music-context';

export const useCanControlMusic = () => {
  const { canControl } = useRoomMusicContext();

  return canControl;
};
