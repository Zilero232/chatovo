import { useEffect, useEffectEvent, useRef } from 'react';

import { useAppSettings } from '@/entities/app/settings';

import type { DmCallLoopKind } from '../../config';

import { DM_CALL_LOOP_SRC } from '../../config';

export const useCallLoopSound = (active: boolean, kind: DmCallLoopKind) => {
  const { settings } = useAppSettings();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { enabled: soundsEnabled, volume } = settings.sounds;

  const readVolume = useEffectEvent(() => volume);

  useEffect(() => {
    if (!active || !soundsEnabled.call) {
      return;
    }

    const audio = new Audio(DM_CALL_LOOP_SRC[kind]);
    audio.loop = true;
    audio.volume = readVolume();
    audioRef.current = audio;

    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audioRef.current = null;
    };
  }, [active, kind, soundsEnabled.call]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
};
