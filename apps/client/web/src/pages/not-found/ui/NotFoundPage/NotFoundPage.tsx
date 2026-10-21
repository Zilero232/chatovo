import { Button, Chato, StatusScreen } from '@chatovo/ui-kit';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { ArrowLeft, House } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ROUTES } from '@/shared/constants';

import s from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const router = useRouter();

  const t = useTranslations('notFound');

  return (
    <main className={s.root}>
      <StatusScreen
        actions={
          <>
            <Button onClick={() => navigate({ to: ROUTES.lobby })}>
              <House />
              {t('toLobby')}
            </Button>

            <Button variant='ghost' onClick={() => router.history.back()}>
              <ArrowLeft />
              {t('back')}
            </Button>
          </>
        }
        code='404'
        description={t('description')}
        illustration={<Chato className={s.chato} pose='peek' />}
        title={t('title')}
      />
    </main>
  );
};
