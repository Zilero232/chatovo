'use client';

import { Button, IconButtonWithTooltip, Text } from '@chatovo/ui-kit';
import { AudioLines, Pause, Play, SkipForward, Square } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { useRoomMusicShare } from '../../../model/hooks';

import s from './ShareStatus.module.scss';

export const ShareStatus = () => {
  const t = useTranslations('room.music.share');

  const { state, togglePause, next, stop } = useRoomMusicShare();

  const label = match(state)
    .with({ mode: 'files' }, ({ files, index, isPaused }) =>
      t(isPaused ? 'paused' : 'playingFile', { name: files[index]?.name ?? '' })
    )
    .otherwise(() => t('sharingTab'));

  return (
    <section className={s.root}>
      <div className={s.status}>
        <AudioLines aria-hidden className={s.icon} />
        <Text className={s.label} size='sm'>
          {label}
        </Text>
      </div>

      <div className={s.actions}>
        {state.mode === 'files' && (
          <>
            <IconButtonWithTooltip
              icon={state.isPaused ? <Play /> : <Pause />}
              label={state.isPaused ? t('resume') : t('pause')}
              tooltipSide='top'
              variant='secondary'
              onClick={togglePause}
            />
            <IconButtonWithTooltip
              icon={<SkipForward />}
              label={t('next')}
              tooltipSide='top'
              onClick={() => void next()}
            />
          </>
        )}
        <Button size='sm' variant='destructive' onClick={() => void stop()}>
          <Square aria-hidden />
          {t('stop')}
        </Button>
      </div>
    </section>
  );
};
