import { useAppSettings } from '@/entities/app/settings';

export const useMusicVolume = () => {
  const { settings, setGroup } = useAppSettings();

  const setVolume = (next: number) => {
    setGroup('music', { volume: next });
  };

  return { volume: settings.music.volume, setVolume };
};
