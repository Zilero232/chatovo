'use client';

import { Stack, Text } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { RoomPasswordHeaderProps } from './RoomPasswordHeader.types';

import s from '../../RoomPasswordForm.module.scss';

export const RoomPasswordHeader = ({ displayName }: RoomPasswordHeaderProps) => {
  const t = useTranslations('room.password');

  return (
    <>
      <span aria-hidden className={clsx(s.badge, 'glass')}>
        <Lock className={s.badgeIcon} />
      </span>

      <Stack align='center' gap='2'>
        <Text as='h1' className={s.heading} weight='semibold'>
          {t('heading')}
        </Text>

        <Text align='center' size='sm' tone='muted'>
          {t('hint', { name: displayName })}
        </Text>
      </Stack>
    </>
  );
};
