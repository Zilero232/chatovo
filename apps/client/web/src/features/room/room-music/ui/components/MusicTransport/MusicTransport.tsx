import { IconButtonWithTooltip } from '@chatovo/ui-kit';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { MusicTransportProps } from './MusicTransport.types';

import s from './MusicTransport.module.scss';

export const MusicTransport = ({
  isPlaying,
  isPending,
  size,
  tooltipSide,
  className,
  onPrevious,
  onTogglePlay,
  onNext
}: MusicTransportProps) => {
  const t = useTranslations('room.music.nowPlaying');

  const isCompact = size === 'compact';

  return (
    <div className={className}>
      <IconButtonWithTooltip
        disabled={isPending}
        icon={<SkipBack />}
        label={t('previous')}
        size={isCompact ? 'icon-sm' : 'icon'}
        tooltipSide={tooltipSide}
        onClick={onPrevious}
      />
      <IconButtonWithTooltip
        className={s.play}
        disabled={isPending}
        icon={isPlaying ? <Pause /> : <Play />}
        label={isPlaying ? t('pause') : t('play')}
        size={isCompact ? 'icon-sm' : 'icon-lg'}
        tooltipSide={tooltipSide}
        variant='default'
        onClick={onTogglePlay}
      />
      <IconButtonWithTooltip
        disabled={isPending}
        icon={<SkipForward />}
        label={t('next')}
        size={isCompact ? 'icon-sm' : 'icon'}
        tooltipSide={tooltipSide}
        onClick={onNext}
      />
    </div>
  );
};
