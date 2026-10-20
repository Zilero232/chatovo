'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useRef } from 'react';
import { clamp } from 'remeda';
import { toast } from 'sonner';

import {
  ALONE_AFTER_MS,
  ALONE_AMBIENCE_SRC,
  ALONE_FADE_MS,
  ALONE_FADE_STEP_MS,
  ALONE_TARGET_VOLUME
} from '../../config';

type AloneAmbienceArgs = {
  isAlone: boolean;
  isEnabled: boolean;
};

export const useAloneAmbience = ({ isAlone, isEnabled }: AloneAmbienceArgs) => {
  const t = useTranslations('easterEggs.ambience');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  const announce = useEffectEvent(() => {
    toast(t('started'), {
      id: 'alone-ambience',
      description: t('description'),
      icon: '🎧',
      duration: 5000
    });
  });

  useEffect(() => {
    const stopFade = () => {
      if (fadeRef.current !== null) {
        window.clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    };

    const fadeTo = (target: number, onDone?: () => void) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      stopFade();

      const stepCount = Math.max(1, Math.round(ALONE_FADE_MS / ALONE_FADE_STEP_MS));
      const delta = (target - audio.volume) / stepCount;

      fadeRef.current = window.setInterval(() => {
        const next = audio.volume + delta;
        const reached = delta >= 0 ? next >= target : next <= target;

        audio.volume = reached ? target : clamp(next, { min: 0, max: 1 });

        if (reached) {
          stopFade();
          onDone?.();
        }
      }, ALONE_FADE_STEP_MS);
    };

    if (!isEnabled || !isAlone) {
      if (audioRef.current) {
        fadeTo(0, () => audioRef.current?.pause());
      }

      return stopFade;
    }

    const startTimer = window.setTimeout(() => {
      const audio = audioRef.current ?? new Audio(ALONE_AMBIENCE_SRC);

      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;

      audio
        .play()
        .then(() => {
          announce();
          fadeTo(ALONE_TARGET_VOLUME);
        })
        .catch(() => {});
    }, ALONE_AFTER_MS);

    return () => {
      window.clearTimeout(startTimer);
      stopFade();
    };
  }, [isAlone, isEnabled]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    []
  );
};
