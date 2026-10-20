import type { Target, Transition } from 'motion/react';

export const INVITE_ICON_ANIMATE: Target = { opacity: 1, scale: 1, rotate: 0 };

export const INVITE_ICON_INITIAL: Target = { opacity: 0, scale: 0.3, rotate: -30 };

export const INVITE_ICON_EXIT: Target = { opacity: 0, scale: 0.3 };

export const INVITE_ICON_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 24
};
