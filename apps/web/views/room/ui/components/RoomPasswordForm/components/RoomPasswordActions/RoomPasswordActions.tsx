'use client';

import { Button, Stack, SubmitButton } from '@chatovo/ui-kit';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/constants';

import type { RoomPasswordActionsProps } from './RoomPasswordActions.types';

import s from '../../RoomPasswordForm.module.scss';

export const RoomPasswordActions = ({ isSubmitting }: RoomPasswordActionsProps) => {
  const t = useTranslations('room.password');
  const tRoom = useTranslations('room');
  const router = useRouter();

  return (
    <Stack className={s.actions} gap='2'>
      <SubmitButton isPending={isSubmitting} size='lg'>
        <KeyRound />
        {t('join')}
      </SubmitButton>

      <Button size='sm' variant='ghost' onClick={() => router.replace(ROUTES.lobby)}>
        <ArrowLeft />
        {tRoom('backToLobby')}
      </Button>
    </Stack>
  );
};
