import { Button, Stack, SubmitButton } from '@chatovo/ui-kit';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ROUTES } from '@/shared/constants';

import type { RoomPasswordActionsProps } from './RoomPasswordActions.types';

import s from '../../RoomPasswordForm.module.scss';

export const RoomPasswordActions = ({ isSubmitting }: RoomPasswordActionsProps) => {
  const t = useTranslations('room.password');
  const tRoom = useTranslations('room');
  const navigate = useNavigate();

  return (
    <Stack className={s.actions} gap='2'>
      <SubmitButton isPending={isSubmitting} size='lg'>
        <KeyRound />
        {t('join')}
      </SubmitButton>

      <Button
        size='sm'
        variant='ghost'
        onClick={() => navigate({ to: ROUTES.lobby, replace: true })}
      >
        <ArrowLeft />
        {tRoom('backToLobby')}
      </Button>
    </Stack>
  );
};
