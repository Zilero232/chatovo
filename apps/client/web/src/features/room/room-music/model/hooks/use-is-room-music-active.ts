import { useRoomMusicContext } from '../contexts';

export const useIsRoomMusicActive = () => {
  const { isMusicActive } = useRoomMusicContext();

  return isMusicActive;
};
