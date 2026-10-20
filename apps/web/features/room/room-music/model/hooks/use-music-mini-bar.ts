'use client';

import type { MusicTrack } from '@chatovo/schemas';

import { useTranslations } from 'next-intl';

import { useRoomMusicContext } from '../contexts/room-music-context';
import { usePlaybackControls } from './use-playback-controls';

export const useMusicMiniBar = (track: MusicTrack) => {
  const t = useTranslations('room.music');

  const { canControl, setBarSlot, setIsExpanded } = useRoomMusicContext();
  const { isPlaying, isPending, togglePlay, previous, next } = usePlaybackControls();

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
    expand: () => setIsExpanded(true)
  };
};
