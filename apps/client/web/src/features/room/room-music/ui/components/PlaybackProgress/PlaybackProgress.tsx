import { Slider } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { PlaybackProgressProps } from './PlaybackProgress.types';

import { formatPlaybackTime } from '../../../lib/index';

import s from './PlaybackProgress.module.scss';

export const PlaybackProgress = ({ progress }: PlaybackProgressProps) => {
  const t = useTranslations('room.music.progress');

  const { positionMs, durationMs, preview, seek } = progress;

  if (durationMs === null) {
    return <span aria-hidden className={s.placeholder} />;
  }

  return (
    <Slider
      aria-label={t('seek')}
      getAriaValueText={(_, value) => formatPlaybackTime(value)}
      max={durationMs}
      min={0}
      step={1000}
      thumbLabel={t('seek')}
      value={positionMs}
      onValueChange={(next) => preview(next as number)}
      onValueCommitted={(next, { reason }) => seek({ positionMs: next as number, reason })}
    />
  );
};
