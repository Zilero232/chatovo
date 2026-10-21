import { Button, Chato, StatusScreen } from '@chatovo/ui-kit';
import { useNavigate } from '@tanstack/react-router';
import { House, RotateCw } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ROUTES } from '@/shared/constants';

import type { ErrorPageProps } from './ErrorPage.types';

import s from './ErrorPage.module.scss';

export const ErrorPage = ({ reset }: ErrorPageProps) => {
  const navigate = useNavigate();

  const t = useTranslations('errorPage');

  return (
    <main className={s.root}>
      <StatusScreen
        actions={
          <>
            <Button onClick={reset}>
              <RotateCw />
              {t('retry')}
            </Button>

            <Button variant='ghost' onClick={() => navigate({ to: ROUTES.lobby })}>
              <House />
              {t('toLobby')}
            </Button>
          </>
        }
        description={t('description')}
        illustration={<Chato className={s.chato} pose='sleep' />}
        title={t('title')}
      />
    </main>
  );
};
