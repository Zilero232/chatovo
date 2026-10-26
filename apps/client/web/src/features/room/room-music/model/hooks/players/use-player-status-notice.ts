import type { MusicTrack } from '@chatovo/schemas';

import { useTranslations } from 'use-intl';

import { usePlaybackControls } from '../playback/use-playback-controls';
import { useCanControlMusic } from '../use-can-control-music';
import { usePlayerStatus } from './use-player-status';

export const usePlayerStatusNotice = (track: MusicTrack) => {
  const t = useTranslations('room.music');

  const { status, failure, retry } = usePlayerStatus(track.id);
  const canControl = useCanControlMusic();
  const { next } = usePlaybackControls();

  return {
    status,
    failure,
    service: t(`sources.${track.source}`),
    canSkip: canControl,
    retry,
    skip: next
  };
};
