'use client';

import { target, useEventListener } from '@siberiacancode/reactuse';
import { useRef } from 'react';

import { KONAMI_SEQUENCE } from '../../config';
import { isTypingTarget } from '../../lib';

export const useKonamiCode = (onUnlock: () => void) => {
  const progressRef = useRef(0);

  useEventListener(target(window), 'keydown', (event) => {
    if (isTypingTarget(event.target)) {
      return;
    }

    const expected = KONAMI_SEQUENCE[progressRef.current];

    if (event.code !== expected) {
      progressRef.current = event.code === KONAMI_SEQUENCE[0] ? 1 : 0;

      return;
    }

    progressRef.current += 1;

    if (progressRef.current === KONAMI_SEQUENCE.length) {
      progressRef.current = 0;
      onUnlock();
    }
  });
};
