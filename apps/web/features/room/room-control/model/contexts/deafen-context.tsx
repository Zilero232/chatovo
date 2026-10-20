'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

const useDeafenState = () => {
  const [isDeafened, setIsDeafened] = useState(false);

  const micBeforeDeafenRef = useRef(false);
  const deafenQueueRef = useRef<Promise<void>>(Promise.resolve());
  const deafenedRef = useRef(false);

  return { isDeafened, setIsDeafened, micBeforeDeafenRef, deafenQueueRef, deafenedRef };
};

const { Provider, use } = createContextHook(useDeafenState);

export const DeafenProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useDeafenContext = () => {
  const value = use();

  if (!value) {
    throw new Error('useDeafenContext must be used within DeafenProvider');
  }

  return value;
};
