'use client';

import { useState } from 'react';

import { useAppSettings } from '@/entities/app/settings';
import { appEvents } from '@/shared/lib';

import type { PttState } from '../../lib/mic-visual';

export const usePttActive = (): PttState => {
  const [isHeld, setIsHeld] = useState(false);

  const { settings } = useAppSettings();

  appEvents.on.pttHold((payload) => {
    setIsHeld(payload.phase === 'pressed');
  });

  if (settings.audio.activationMode !== 'pushToTalk') {
    return 'disabled';
  }

  return isHeld ? 'active' : 'idle';
};
