import { IconButtonWithTooltip } from '@chatovo/ui-kit';
import { Pause, Play, SkipBack, SkipForward, Square } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { usePlaybackControls } from '../../../model/hooks';

import s from './StageControls.module.scss';

export const StageControls = () => {
  const t = useTranslations('room.music.nowPlaying');

  const { isPlaying, isPending, togglePlay, previous, next, stop } = usePlaybackControls();

  return (
    <div className={s.root}>
      <span aria-hidden className={s.spacer} />

      <div className={s.transport}>
        <IconButtonWithTooltip
          disabled={isPending}
          icon={<SkipBack />}
          label={t('previous')}
          size='icon'
          onClick={previous}
        />
        <IconButtonWithTooltip
          disabled={isPending}
          icon={isPlaying ? <Pause /> : <Play />}
          label={isPlaying ? t('pause') : t('play')}
          size='icon-lg'
          variant='default'
          onClick={togglePlay}
        />
        <IconButtonWithTooltip
          disabled={isPending}
          icon={<SkipForward />}
          label={t('next')}
          size='icon'
          onClick={next}
        />
      </div>

      <IconButtonWithTooltip
        disabled={isPending}
        icon={<Square />}
        label={t('stop')}
        size='icon-sm'
        onClick={stop}
      />
    </div>
  );
};
