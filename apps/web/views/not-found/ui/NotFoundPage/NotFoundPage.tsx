import { Button, Chato, Text } from '@chatovo/ui-kit';
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
      <Chato className={s.chato} pose='peek' />

      <p className={s.code}>404</p>

      <h1 className={s.title}>{t('title')}</h1>
      <Text className={s.description} tone='muted'>
        {t('description')}
      </Text>

      <div className={s.actions}>
        <Button onClick={() => navigate({ to: ROUTES.lobby })}>
          <House />
          {t('toLobby')}
        </Button>

        <Button variant='ghost' onClick={() => router.history.back()}>
          <ArrowLeft />
          {t('back')}
        </Button>
      </div>
    </main>
  );
};
