import { useRoomMusicContext } from '../../contexts';

export const useRoomMusicShare = () => {
  const { share } = useRoomMusicContext();

  return share;
};
