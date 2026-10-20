import type { Target, Transition } from 'motion/react';

export const CONTROL_ICON_ANIMATE: Target = { opacity: 1, scale: 1, rotate: 0 };

export const CONTROL_ICON_INITIAL: Target = { opacity: 0, scale: 0.4, rotate: -20 };

export const CONTROL_ICON_EXIT: Target = { opacity: 0, scale: 0.4, rotate: 20 };

export const CONTROL_ICON_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 26
};
