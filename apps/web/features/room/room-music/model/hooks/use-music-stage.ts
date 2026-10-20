'use client';

import type { MusicTrack } from '@chatovo/schemas';

import { useTranslations } from 'next-intl';

import { useRoomMusicContext } from '../contexts/room-music-context';

export const useMusicStage = (track: MusicTrack) => {
  const t = useTranslations('room.music');

  const { setStageSlot } = useRoomMusicContext();

  return {
    subtitle: track.artist ?? t('nowPlaying.addedBy', { name: track.addedBy.name }),
    setSlot: setStageSlot
  };
};
