import type { Target, Transition } from 'motion/react';

export const LIST_ITEM_INITIAL: Target = { opacity: 0, y: 8 };

export const LIST_ITEM_ANIMATE: Target = { opacity: 1, y: 0 };

export const LIST_ITEM_EXIT: Target = { opacity: 0, scale: 0.95 };

export const LIST_ITEM_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 460,
  damping: 34
};

export const ENTER_INITIAL: Target = { opacity: 0, y: 12 };

export const ENTER_ANIMATE: Target = { opacity: 1, y: 0 };

export const ENTER_TRANSITION: Transition = { duration: 0.32, ease: 'easeOut' };
