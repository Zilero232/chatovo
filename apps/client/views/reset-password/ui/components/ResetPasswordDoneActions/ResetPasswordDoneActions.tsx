'use client';

import { isTauri } from '@tauri-apps/api/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { DEEP_LINKS, ROUTES } from '@/shared/constants';
import { Button } from '@/ui-kit';

import s from './ResetPasswordDoneActions.module.scss';

export const ResetPasswordDoneActions = () => {
  const router = useRouter();
  const t = useTranslations('auth');

  if (isTauri()) {
    return (
      <Button
        className={s.action}
        size='lg'
        type='button'
        onClick={() => router.replace(ROUTES.auth)}
      >
        {t('signInInBrowser')}
      </Button>
    );
  }

  return (
    <div className={s.root}>
      <Button className={s.action} href={ROUTES.auth} size='lg'>
        {t('signInInBrowser')}
      </Button>

      <Button className={s.action} href={DEEP_LINKS.auth} size='lg' variant='secondary'>
        {t('openInApp')}
      </Button>
    </div>
  );
};
