import { clsx } from 'clsx';
import { motion } from 'motion/react';

import type { MusicBarFrameProps } from './MusicBarFrame.types';

import { MUSIC_BAR_MOTION } from '../../../config/motion';
import { useFloatingBarSpace } from '../../../model/hooks';

import s from './MusicBarFrame.module.scss';

export const MusicBarFrame = ({ children, isMinimized, label }: MusicBarFrameProps) => {
  const setBarNode = useFloatingBarSpace(isMinimized);

  return (
    <motion.div
      animate='shown'
      className={clsx(s.slot, isMinimized && s.passThrough)}
      exit='hidden'
      initial='hidden'
      transition={MUSIC_BAR_MOTION.transition}
      variants={isMinimized ? undefined : MUSIC_BAR_MOTION.docked}
    >
      <motion.section
        ref={setBarNode}
        aria-label={label}
        className={clsx(s.root, isMinimized ? s.floating : s.docked)}
        transition={MUSIC_BAR_MOTION.transition}
        variants={isMinimized ? MUSIC_BAR_MOTION.floating : undefined}
      >
        {children}
      </motion.section>
    </motion.div>
  );
};
