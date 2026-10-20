'use client';

import { useEffect, useEffectEvent } from 'react';

/**
 * Runs `callback` whenever `condition` turns true, and only on that transition.
 * The callback is read fresh each time, so it never has to be memoised.
 */
export const useRunWhen = (condition: boolean, callback: () => void) => {
  const run = useEffectEvent(callback);

  useEffect(() => {
    if (condition) {
      run();
    }
  }, [condition]);
};
