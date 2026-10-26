import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import type { PlaybackTimeProps } from './PlaybackTime.types';

import { formatPlaybackTime } from '../../../lib/index';

import s from './PlaybackTime.module.scss';

export const PlaybackTime = ({ progress, className }: PlaybackTimeProps) => {
  const t = useTranslations('room.music');

  const { isLive, positionMs, durationMs } = progress;

  if (isLive) {
    return (
      <span className={clsx(s.live, className)}>
        <span aria-hidden className={s.liveDot} />
        {t('nowPlaying.live')}
      </span>
    );
  }

  return (
    <span className={clsx(s.time, className)}>
      {formatPlaybackTime(positionMs)}
      <span className={s.separator}> / </span>
      {durationMs === null ? t('progress.unknown') : formatPlaybackTime(durationMs)}
    </span>
  );
};
