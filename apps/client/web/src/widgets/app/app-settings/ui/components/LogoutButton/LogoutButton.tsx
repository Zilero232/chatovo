import { Button } from '@chatovo/ui-kit';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { releasePushDevice } from '@/features/app/push-notifications';
import { authClient, clearToken, queryClient } from '@/shared/api';

import s from '../../AppSettingsButton.module.scss';

export const LogoutButton = () => {
  const t = useTranslations('settings');
  const toastError = useToastError();

  const handleLogout = async () => {
    await releasePushDevice().catch(() => {});

    const { error } = await authClient.signOut();

    clearToken();
    queryClient.clear();

    if (error) {
      toastError('sign-out')(error);

      return;
    }

    toast.success(t('signedOut'), { id: 'sign-out' });
  };

  return (
    <Button
      aria-label={t('logout')}
      className={s.logoutButton}
      size='sm'
      title={t('logout')}
      variant='ghost'
      onClick={handleLogout}
    >
      <LogOut aria-hidden />
      <span className={s.logoutLabel}>{t('logout')}</span>
    </Button>
  );
};
