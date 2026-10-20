'use client';

import { Button, Chato, Text } from '@chatovo/ui-kit';
import { ArrowLeft, House } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/constants';

import s from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
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
        <Button onClick={() => router.push(ROUTES.lobby)}>
          <House />
          {t('toLobby')}
        </Button>

        <Button variant='ghost' onClick={() => router.back()}>
          <ArrowLeft />
          {t('back')}
        </Button>
      </div>
    </main>
  );
};
