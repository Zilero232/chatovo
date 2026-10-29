import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';

export const useIsInvisible = () => {
  const { can } = useCurrentUser();
  const { settings } = useAppSettings();

  return can('invisible') && settings.system.invisibleMode;
};
