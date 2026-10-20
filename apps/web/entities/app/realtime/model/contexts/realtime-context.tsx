'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';

import { useRealtimeState } from '../hooks/use-realtime-state';

const { Provider, use } = createContextHook(useRealtimeState);

export const RealtimeProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useRealtime = () => {
  const value = use();

  if (!value) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }

  return value;
};
