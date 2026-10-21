import { useRoomMusicContext } from '../contexts';

export const useMusicDialog = () => {
  const { isExpanded, setIsExpanded } = useRoomMusicContext();

  return {
    isOpen: isExpanded,
    setIsOpen: setIsExpanded,
    open: () => setIsExpanded(true)
  };
};
