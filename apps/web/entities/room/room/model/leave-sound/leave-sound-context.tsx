'use client';

import type { ReactNode } from 'react';

import { createContextHook, useAudio } from '@siberiacancode/reactuse';

const useLeaveSoundValue = () => {
  const { play, setVolume } = useAudio('/audios/room/leave.mp3', { interrupt: true });

  return async (volume = 1) => {
    try {
      setVolume(volume);
      await play();
    } catch {}
  };
};

const { Provider, use } = createContextHook(useLeaveSoundValue);

export const LeaveSoundProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useLeaveSound = () => {
  const value = use();

  if (!value) {
    throw new Error('useLeaveSound must be used within LeaveSoundProvider');
  }

  return value;
};
