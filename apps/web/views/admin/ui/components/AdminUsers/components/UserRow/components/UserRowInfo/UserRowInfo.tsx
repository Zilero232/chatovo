'use client';

import { Row, Stack, Text } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';

import { formatDateTime } from '@/shared/lib';

import type { UserRowInfoProps } from './UserRowInfo.types';

import { UserBadges } from '../../../UserBadges/UserBadges';

import s from '../../UserRow.module.scss';

export const UserRowInfo = ({ user }: UserRowInfoProps) => {
  const t = useTranslations('admin');

  const name = user.displayName ?? user.name;

  return (
    <Stack className={s.info} gap='1'>
      <Row wrap align='center' gap='2'>
        <Text truncate size='sm' weight='medium'>
          {name}
        </Text>

        <UserBadges user={user} />
      </Row>

      <Text truncate size='xs' tone='muted'>
        {user.email} · {user.friendTag} ·{' '}
        {t('users.joined', { date: formatDateTime(user.createdAt) })}
      </Text>

      <Text size='xs' tone='muted'>
        {t('users.roomsCount', { count: user.roomsCount })} ·{' '}
        {t('users.messagesCount', { count: user.messagesCount })}
      </Text>
    </Stack>
  );
};
