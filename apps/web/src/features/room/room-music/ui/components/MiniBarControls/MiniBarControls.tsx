import { IconButtonWithTooltip } from '@chatovo/ui-kit';
import { Maximize2, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { MiniBarControlsProps } from './MiniBarControls.types';

import s from './MiniBarControls.module.scss';

export const MiniBarControls = ({ bar }: MiniBarControlsProps) => {
  const t = useTranslations('room.music.nowPlaying');

  const { isPlaying, isPending, togglePlay, previous, next, expand } = bar;

  return (
    <div className={s.root}>
      <IconButtonWithTooltip
        disabled={isPending}
        icon={<SkipBack />}
        label={t('previous')}
        size='icon-sm'
        tooltipSide='top'
        onClick={previous}
      />
      <IconButtonWithTooltip
        className={s.play}
        disabled={isPending}
        icon={isPlaying ? <Pause /> : <Play />}
        label={isPlaying ? t('pause') : t('play')}
        size='icon-sm'
        tooltipSide='top'
        variant='default'
        onClick={togglePlay}
      />
      <IconButtonWithTooltip
        disabled={isPending}
        icon={<SkipForward />}
        label={t('next')}
        size='icon-sm'
        tooltipSide='top'
        onClick={next}
      />
      <IconButtonWithTooltip
        className={s.expand}
        icon={<Maximize2 />}
        label={t('expand')}
        size='icon-sm'
        tooltipSide='top'
        onClick={expand}
      />
    </div>
  );
};
