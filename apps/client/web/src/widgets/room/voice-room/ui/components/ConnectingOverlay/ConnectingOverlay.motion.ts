import type { Target, Transition } from 'motion/react';

export const OVERLAY_TRANSITION: Transition = { duration: 0.25 };

export const BOX_ANIMATE: Target = { opacity: 1, scale: 1, y: 0 };

export const BOX_INITIAL: Target = { opacity: 0, scale: 0.9, y: 8 };

export const BOX_EXIT: Target = { opacity: 0, scale: 0.95 };

export const BOX_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30
};
