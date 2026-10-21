import { useRoomMusicContext } from '../contexts';

export const useCanControlMusic = () => {
  const { canControl } = useRoomMusicContext();

  return canControl;
};
