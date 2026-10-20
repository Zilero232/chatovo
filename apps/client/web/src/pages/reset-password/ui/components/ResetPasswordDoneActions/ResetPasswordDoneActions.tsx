import { Button } from '@chatovo/ui-kit';
import { useNavigate } from '@tanstack/react-router';
import { isTauri } from '@tauri-apps/api/core';
import { useTranslations } from 'use-intl';

import { DEEP_LINKS, ROUTES } from '@/shared/constants';

import s from './ResetPasswordDoneActions.module.scss';

export const ResetPasswordDoneActions = () => {
  const navigate = useNavigate();
  const t = useTranslations('auth');

  if (isTauri()) {
    return (
      <Button
        className={s.action}
        size='lg'
        type='button'
        onClick={() => navigate({ to: ROUTES.auth, replace: true })}
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
