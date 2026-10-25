import { clsx } from 'clsx';
import { motion } from 'motion/react';

import { ENTER_ANIMATE, ENTER_INITIAL, ENTER_TRANSITION } from '@/shared/config';

import type { MusicBarFrameProps } from './MusicBarFrame.types';

import { useFloatingBarSpace } from '../../../model/hooks';

import s from './MusicBarFrame.module.scss';

export const MusicBarFrame = ({ children, isMinimized, label }: MusicBarFrameProps) => {
  const setBarNode = useFloatingBarSpace(isMinimized);

  return (
    <motion.section
      ref={setBarNode}
      animate={ENTER_ANIMATE}
      aria-label={label}
      className={clsx(s.root, isMinimized ? s.floating : s.docked)}
      exit={ENTER_INITIAL}
      initial={ENTER_INITIAL}
      transition={ENTER_TRANSITION}
    >
      {children}
    </motion.section>
  );
};
