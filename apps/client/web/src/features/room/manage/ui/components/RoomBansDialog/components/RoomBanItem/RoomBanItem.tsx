import { Button, Text } from '@chatovo/ui-kit';
import { ShieldCheck } from 'lucide-react';
import { useFormatter, useTranslations } from 'use-intl';

import { UserAvatar } from '@/entities/auth/user';

import type { RoomBanItemProps } from './RoomBanItem.types';

import s from './RoomBanItem.module.scss';

export const RoomBanItem = ({ ban, isBusy, onUnban }: RoomBanItemProps) => {
  const t = useTranslations('roomModeration.bans');
  const format = useFormatter();

  const { user, bannedAt } = ban;

  return (
    <li className={s.root}>
      <UserAvatar className={s.avatar} name={user.name} size='sm' src={user.avatarUrl} />

      <span className={s.meta}>
        <Text truncate size='sm' weight='medium'>
          {user.name}
        </Text>
        <Text truncate size='xs' tone='muted'>
          {t('bannedAt', { date: format.dateTime(new Date(bannedAt), { dateStyle: 'medium' }) })}
        </Text>
      </span>

      <Button
        aria-label={t('unbanUser', { name: user.name })}
        className={s.unban}
        disabled={isBusy}
        size='sm'
        variant='secondary'
        onClick={onUnban}
      >
        <ShieldCheck aria-hidden />
        {t('unban')}
      </Button>
    </li>
  );
};
