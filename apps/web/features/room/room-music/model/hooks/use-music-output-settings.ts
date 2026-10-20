'use client';

import { useAppSettings } from '@/entities/app/settings';

export const useMusicOutputSettings = () => {
  const { settings, setGroup } = useAppSettings();

  const { volume, ducking } = settings.music;

  return {
    volume,
    ducking,
    setVolume: (next: number) => setGroup('music', { volume: next }),
    setDucking: (next: boolean) => setGroup('music', { ducking: next })
  };
};
