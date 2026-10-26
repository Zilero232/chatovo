import { Button } from '@chatovo/ui-kit';
import {
  CircleAlert,
  LoaderCircle,
  Play,
  RotateCw,
  ShieldOff,
  SkipForward,
  VolumeX,
  WifiOff
} from 'lucide-react';
import { motion } from 'motion/react';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import type { PlayerStatusNoticeProps } from './PlayerStatusNotice.types';

import { PLAYER_NOTICE_MOTION } from '../../../config/motion';
import { usePlayerStatusNotice } from '../../../model/hooks';

import s from './PlayerStatusNotice.module.scss';

export const PlayerStatusNotice = ({ track }: PlayerStatusNoticeProps) => {
  const t = useTranslations('room.music.player');

  const { status, failure, service, canSkip, retry, skip } = usePlayerStatusNotice(track);

  if (status === 'loading') {
    return (
      <motion.p
        animate={PLAYER_NOTICE_MOTION.animate}
        aria-live='polite'
        className={s.loading}
        initial={PLAYER_NOTICE_MOTION.initial}
        role='status'
        transition={PLAYER_NOTICE_MOTION.transition}
      >
        <LoaderCircle aria-hidden className={s.spinner} />
        {t('connecting', { service })}
      </motion.p>
    );
  }

  if (failure === null) {
    return null;
  }

  return (
    <div className={s.unavailable} role='alert'>
      {match(failure)
        .with('network', () => <WifiOff aria-hidden className={s.icon} />)
        .with('restricted', () => <ShieldOff aria-hidden className={s.icon} />)
        .with('failed', () => <CircleAlert aria-hidden className={s.icon} />)
        .with('blocked', () => <VolumeX aria-hidden className={s.icon} />)
        .exhaustive()}

      <div className={s.text}>
        <p className={s.title}>{t(`${failure}Title`, { service })}</p>
        <p className={s.hint}>{t(`${failure}Hint`)}</p>
      </div>

      <div className={s.actions}>
        <Button size='sm' variant='secondary' onClick={retry}>
          {failure === 'blocked' ? <Play aria-hidden /> : <RotateCw aria-hidden />}
          {failure === 'blocked' ? t('listen') : t('retry')}
        </Button>

        {canSkip && failure !== 'blocked' && (
          <Button size='sm' variant='ghost' onClick={skip}>
            <SkipForward aria-hidden />
            {t('skip')}
          </Button>
        )}
      </div>
    </div>
  );
};
