'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useState } from 'react';

const useLocalSpeakingState = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  return { isSpeaking, setIsSpeaking };
};

const { Provider, use: useLocalSpeakingContext } = createContextHook(useLocalSpeakingState);

export const LocalSpeakingProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useLocalSpeaking = () => {
  const value = useLocalSpeakingContext();

  if (!value) {
    throw new Error('useLocalSpeaking must be used within LocalSpeakingProvider');
  }

  return value;
};
