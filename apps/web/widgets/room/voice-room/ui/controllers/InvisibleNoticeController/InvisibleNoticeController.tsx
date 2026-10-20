'use client';

import { useMount } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';

export const InvisibleNoticeController = () => {
  const t = useTranslations('room');

  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();

  useMount(() => {
    if (isAdmin && settings.system.invisibleMode) {
      toast.info(t('invisibleNotice'), { id: 'invisible-notice' });
    }
  });

  return null;
};
