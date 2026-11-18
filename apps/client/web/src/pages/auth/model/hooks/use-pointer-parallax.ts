import type { RefObject } from 'react';

import { useReducedMotion } from 'motion/react';
import { useEffect } from 'react';

export const usePointerParallax = (ref: RefObject<HTMLElement | null>) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (!element || prefersReducedMotion || !hasFinePointer) {
      return;
    }

    let frame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        element.style.setProperty('--px', String(event.clientX / window.innerWidth - 0.5));
        element.style.setProperty('--py', String(event.clientY / window.innerHeight - 0.5));
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [ref, prefersReducedMotion]);
};
