import type { Target, Transition } from 'motion/react';

export const REVEAL_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30
};

export const REVEAL_INITIAL: Target = { opacity: 0, y: 24 };

export const REVEAL_IN_VIEW: Target = { opacity: 1, y: 0 };

export const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -80px 0px'
} as const;
