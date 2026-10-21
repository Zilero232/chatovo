import { IconButtonWithTooltip } from '@chatovo/ui-kit';
import { Maximize2, Square } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { MiniBarControlsProps } from './MiniBarControls.types';

import { MusicTransport } from '../MusicTransport/MusicTransport';

import s from './MiniBarControls.module.scss';

export const MiniBarControls = ({ bar }: MiniBarControlsProps) => {
  const t = useTranslations('room.music.nowPlaying');

  const { isPlaying, isPending, togglePlay, previous, next, stop, expand } = bar;

  return (
    <div className={s.root}>
      <MusicTransport
        className={s.transport}
        isPending={isPending}
        isPlaying={isPlaying}
        size='compact'
        tooltipSide='top'
        onNext={next}
        onPrevious={previous}
        onTogglePlay={togglePlay}
      />
      <IconButtonWithTooltip
        disabled={isPending}
        icon={<Square />}
        label={t('stop')}
        size='icon-sm'
        tooltipSide='top'
        onClick={stop}
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
