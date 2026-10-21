import { IconButtonWithTooltip } from '@chatovo/ui-kit';
import { Square } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { usePlaybackControls } from '../../../model/hooks';
import { MusicTransport } from '../MusicTransport/MusicTransport';

import s from './StageControls.module.scss';

export const StageControls = () => {
  const t = useTranslations('room.music.nowPlaying');

  const { isPlaying, isPending, togglePlay, previous, next, stop } = usePlaybackControls();

  return (
    <div className={s.root}>
      <span aria-hidden className={s.spacer} />

      <MusicTransport
        className={s.transport}
        isPending={isPending}
        isPlaying={isPlaying}
        size='regular'
        onNext={next}
        onPrevious={previous}
        onTogglePlay={togglePlay}
      />

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
