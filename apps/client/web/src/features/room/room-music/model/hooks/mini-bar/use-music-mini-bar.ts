import type { MusicTrack } from '@chatovo/schemas';

import { useTranslations } from 'use-intl';

import { useRoomMusicContext } from '../../contexts';
import { usePlaybackControls } from '../playback/use-playback-controls';

export const useMusicMiniBar = (track: MusicTrack) => {
  const t = useTranslations('room.music');

  const { canControl, setBarSlot, setIsExpanded } = useRoomMusicContext();
  const { isPlaying, isPending, togglePlay, previous, next, stop } = usePlaybackControls();

  return {
    subtitle: track.artist ?? t('nowPlaying.addedBy', { name: track.addedBy.name }),
    isRadio: track.source === 'radio',
    canControl,
    isPlaying,
    isPending,
    setSlot: setBarSlot,
    togglePlay,
    previous,
    next,
    stop,
    expand: () => setIsExpanded(true)
  };
};
