'use client';

import { useRef } from 'react';

import { SECRET_CLICK_RESET_MS } from '../../config';

type SecretClicksArgs = {
  count: number;
  onReach: () => void;
};

export const useSecretClicks = ({ count, onReach }: SecretClicksArgs) => {
  const streakRef = useRef(0);
  const lastAtRef = useRef(0);

  return () => {
    const now = performance.now();

    streakRef.current = now - lastAtRef.current > SECRET_CLICK_RESET_MS ? 1 : streakRef.current + 1;
    lastAtRef.current = now;

    if (streakRef.current >= count) {
      streakRef.current = 0;
      onReach();
    }
  };
};
