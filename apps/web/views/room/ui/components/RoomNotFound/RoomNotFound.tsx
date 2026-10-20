'use client';

import { Button, CenteredState } from '@chatovo/ui-kit';
import { DoorClosed } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/constants';

import s from './RoomNotFound.module.scss';

export const RoomNotFound = () => {
  const t = useTranslations('room');
  const router = useRouter();

  return (
    <CenteredState
      action={<Button onClick={() => router.replace(ROUTES.lobby)}>{t('backToLobby')}</Button>}
      description={t('notFoundHint')}
      icon={<DoorClosed className={s.icon} />}
      pattern='waves'
      title={t('notFound')}
    />
  );
};
