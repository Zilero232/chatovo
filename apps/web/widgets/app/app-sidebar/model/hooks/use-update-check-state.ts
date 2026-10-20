'use client';

import { useState } from 'react';

import { appEvents } from '@/shared/lib';

export const useUpdateCheckState = () => {
  const [isChecking, setIsChecking] = useState(false);

  appEvents.on.recheckUpdate(() => setIsChecking(true));
  appEvents.on.updateCheckSettled(() => setIsChecking(false));

  const requestCheck = () => appEvents.emit.recheckUpdate();

  return { isChecking, requestCheck };
};
