import { useReducedMotion } from 'motion/react';

import { ENTER_ANIMATE, ENTER_INITIAL, ENTER_TRANSITION } from '../config';

/** Props for a short rise-and-fade entrance; with reduced motion the element renders in place. */
export const useEnterMotion = (delay = 0) => {
  const reduceMotion = useReducedMotion();

  return {
    animate: ENTER_ANIMATE,
    initial: reduceMotion ? false : ENTER_INITIAL,
    transition: { ...ENTER_TRANSITION, delay }
  } as const;
};
