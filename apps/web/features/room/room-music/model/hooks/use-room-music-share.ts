import { useRoomMusicContext } from '../contexts/room-music-context';

export const useRoomMusicShare = () => {
  const { share } = useRoomMusicContext();

  return share;
};
