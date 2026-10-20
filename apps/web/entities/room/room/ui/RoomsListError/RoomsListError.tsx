'use client';

import { Button, CenteredState, ErrorGlyph } from '@chatovo/ui-kit';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { QUERY_KEYS } from '@/shared/constants';

import s from './RoomsListError.module.scss';

export const RoomsListError = () => {
  const t = useTranslations('lobby.roomsError');
  const queryClient = useQueryClient();

  const retry = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms() });
  };

  return (
    <CenteredState
      action={
        <Button size='sm' type='button' variant='secondary' onClick={retry}>
          {t('retry')}
        </Button>
      }
      description={t('description')}
      icon={<ErrorGlyph className={s.icon} variant='lost-signal' />}
      size='sm'
      title={t('title')}
    />
  );
};
