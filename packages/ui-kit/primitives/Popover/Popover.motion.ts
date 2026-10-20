import type { Transition, Variants } from 'motion/react';

export const POPOVER_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 34,
  mass: 0.7
};

const POPOVER_EXIT_TRANSITION: Transition = { duration: 0.12, ease: 'easeIn' };

export const popoverVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: -4, transition: POPOVER_EXIT_TRANSITION },
  visible: { opacity: 1, scale: 1, y: 0, transition: POPOVER_TRANSITION }
};
