import { useAppSettings } from '@/entities/app/settings';

export const useInvisibleMode = () => {
  const { settings, setGroup } = useAppSettings();

  const { invisibleMode } = settings.system;

  return {
    isInvisible: invisibleMode,
    toggle: () => setGroup('system', { invisibleMode: !invisibleMode })
  };
};
