import { Slider } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { MusicTrackPlayback } from '../../../model/types';

import { formatPlaybackTime } from '../../../lib/index';
import { usePlaybackProgress } from '../../../model/hooks';

import s from './PlaybackProgress.module.scss';

export const PlaybackProgress = ({ music, track }: MusicTrackPlayback) => {
  const t = useTranslations('room.music');

  const { isLive, positionMs, durationMs, preview, seek } = usePlaybackProgress({ music, track });

  if (isLive) {
    return (
      <span className={s.live}>
        <span aria-hidden className={s.liveDot} />
        {t('nowPlaying.live')}
      </span>
    );
  }

  return (
    <div className={s.root}>
      <span className={s.time}>{formatPlaybackTime(positionMs)}</span>
      {durationMs === null ? (
        <span aria-hidden className={s.placeholder} />
      ) : (
        <Slider
          aria-label={t('progress.seek')}
          className={s.slider}
          getAriaValueText={(_, value) => formatPlaybackTime(value)}
          max={durationMs}
          min={0}
          step={1000}
          thumbLabel={t('progress.seek')}
          value={positionMs}
          onValueChange={(next) => preview(next as number)}
          onValueCommitted={(next, { reason }) => seek({ positionMs: next as number, reason })}
        />
      )}
      <span className={s.time}>
        {durationMs === null ? t('progress.unknown') : formatPlaybackTime(durationMs)}
      </span>
    </div>
  );
};
