import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { useTranslations } from 'use-intl';

import { ENTER_ANIMATE, ENTER_INITIAL, ENTER_TRANSITION } from '@/shared/config';

import type { MusicMiniBarProps } from './MusicMiniBar.types';

import { useFloatingBarSpace, useMusicMiniBar } from '../../../model/hooks';
import { MiniBarControls } from '../MiniBarControls/MiniBarControls';
import { MiniProgress } from '../MiniProgress/MiniProgress';
import { RadioAudio } from '../RadioAudio/RadioAudio';
import { TrackArtwork } from '../TrackArtwork/TrackArtwork';

import s from './MusicMiniBar.module.scss';

export const MusicMiniBar = ({ music, track, isMinimized }: MusicMiniBarProps) => {
  const t = useTranslations('room.music');

  const bar = useMusicMiniBar(track);
  const setBarNode = useFloatingBarSpace(isMinimized);

  return (
    <motion.section
      ref={setBarNode}
      animate={ENTER_ANIMATE}
      aria-label={t('label')}
      className={clsx(s.root, isMinimized ? s.floating : s.docked)}
      exit={ENTER_INITIAL}
      initial={ENTER_INITIAL}
      transition={ENTER_TRANSITION}
    >
      <button
        aria-label={t('nowPlaying.expand')}
        className={s.identity}
        disabled={!bar.canControl}
        type='button'
        onClick={bar.expand}
      >
        <span ref={bar.setSlot} className={clsx(s.thumb, bar.isRadio && s.square)}>
          <TrackArtwork size='fill' track={track} />
        </span>

        <span className={s.meta}>
          <span className={s.title}>{track.title}</span>
          <span className={s.subtitle}>{bar.subtitle}</span>
        </span>
      </button>

      {bar.isRadio && <RadioAudio key={track.id} music={music} track={track} />}

      {bar.canControl && <MiniBarControls bar={bar} />}

      <MiniProgress music={music} track={track} />
    </motion.section>
  );
};
