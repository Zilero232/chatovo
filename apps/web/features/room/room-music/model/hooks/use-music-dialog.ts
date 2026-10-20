import { useRoomMusicContext } from '../contexts/room-music-context';

export const useMusicDialog = () => {
  const { isExpanded, setIsExpanded } = useRoomMusicContext();

  return {
    isOpen: isExpanded,
    setIsOpen: setIsExpanded,
    open: () => setIsExpanded(true)
  };
};
