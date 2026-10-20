'use client';

import { House, RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/constants';
import { Button, Chato, Text } from '@/ui-kit';

import type { ErrorPageProps } from './ErrorPage.types';

import s from './ErrorPage.module.scss';

export const ErrorPage = ({ reset }: ErrorPageProps) => {
  const router = useRouter();

  const t = useTranslations('errorPage');

  return (
    <main className={s.root}>
      <Chato className={s.chato} pose='sleep' />

      <h1 className={s.title}>{t('title')}</h1>
      <Text className={s.description} tone='muted'>
        {t('description')}
      </Text>

      <div className={s.actions}>
        <Button onClick={reset}>
          <RotateCw />
          {t('retry')}
        </Button>

        <Button variant='ghost' onClick={() => router.push(ROUTES.lobby)}>
          <House />
          {t('toLobby')}
        </Button>
      </div>
    </main>
  );
};
