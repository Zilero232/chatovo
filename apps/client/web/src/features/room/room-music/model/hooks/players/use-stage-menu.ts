import type { MusicTrack } from '@chatovo/schemas';

import { useTranslations } from 'use-intl';

import { openExternal } from '@/shared/lib';

import { usePlaybackControls } from '../playback/use-playback-controls';

export const useStageMenu = (track: MusicTrack) => {
  const t = useTranslations('room.music');

  const { isPending, stop } = usePlaybackControls();

  const openLabel =
    track.source === 'radio'
      ? t('nowPlaying.openStation')
      : t('nowPlaying.openIn', { service: t(`sources.${track.source}`) });

  return {
    openLabel,
    isPending,
    openSource: () => void openExternal(track.url),
    stop
  };
};
