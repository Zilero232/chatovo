'use client';

import { Button } from '@chatovo/ui-kit';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { releasePushDevice } from '@/features/app/push-notifications';
import { authClient, clearToken } from '@/shared/api';

import s from '../../AppSettingsButton.module.scss';

export const LogoutButton = () => {
  const t = useTranslations('settings');
  const toastError = useToastError();

  const handleLogout = async () => {
    await releasePushDevice().catch(() => {});

    const { error } = await authClient.signOut();

    clearToken();

    if (error) {
      toastError('sign-out')(error);

      return;
    }

    toast.success(t('signedOut'), { id: 'sign-out' });
  };

  return (
    <Button className={s.logoutButton} size='sm' variant='ghost' onClick={handleLogout}>
      <LogOut aria-hidden />
      {t('logout')}
    </Button>
  );
};
