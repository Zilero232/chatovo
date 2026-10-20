'use client';

import { useEffect, useEffectEvent, useRef } from 'react';

import { useAppSettings } from '@/entities/app/settings';

import type { FriendCallSoundKind } from '../../config/call-sounds';

import { FRIEND_CALL_SOUND_SRC } from '../../config/call-sounds';

export const useFriendCallRingtone = (active: boolean, kind: FriendCallSoundKind) => {
  const { settings } = useAppSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { enabled: soundsEnabled, volume } = settings.sounds;

  const readVolume = useEffectEvent(() => volume);

  useEffect(() => {
    if (!active || !soundsEnabled.call) {
      return;
    }

    const audio = new Audio(FRIEND_CALL_SOUND_SRC[kind]);
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
