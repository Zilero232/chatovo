import type { Transition, Variants } from 'motion/react';

export const MUSIC_BAR_MOTION = {
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } satisfies Transition,
  docked: {
    hidden: { height: 0, opacity: 0 },
    shown: { height: 'auto', opacity: 1 }
  } satisfies Variants,
  floating: {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    shown: { opacity: 1, y: 0, scale: 1 }
  } satisfies Variants
} as const;

export const PLAYER_NOTICE_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.6, duration: 0.2 } satisfies Transition
} as const;
