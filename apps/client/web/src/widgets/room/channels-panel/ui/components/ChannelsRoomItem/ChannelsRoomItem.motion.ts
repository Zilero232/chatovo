import type { Target, Transition } from 'motion/react';

export const PARTICIPANTS_INITIAL: Target = { opacity: 0, height: 0 };

export const PARTICIPANTS_ANIMATE: Target = { opacity: 1, height: 'auto' };

export const PARTICIPANTS_EXIT: Target = { opacity: 0, height: 0 };

export const PARTICIPANTS_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 38
};
