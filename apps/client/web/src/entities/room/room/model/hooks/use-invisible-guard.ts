import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useAppSettings } from '@/entities/app/settings';

import { useIsInvisible } from './use-is-invisible';

export const useInvisibleGuard = () => {
  const t = useTranslations('room.invisible');

  const { setGroup } = useAppSettings();
  const isInvisible = useIsInvisible();

  const turnOff = () => setGroup('system', { invisibleMode: false });

  const notifyBlocked = () => {
    toast.info(t('blocked'), {
      id: 'invisible-blocked',
      description: t('blockedHint'),
      action: { label: t('turnOff'), onClick: turnOff }
    });
  };

  const blockIfInvisible = () => {
    if (isInvisible) {
      notifyBlocked();
    }

    return isInvisible;
  };

  return { isInvisible, turnOff, notifyBlocked, blockIfInvisible };
};
