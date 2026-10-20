'use client';

import { Button, TabsList, TabsTrigger } from '@chatovo/ui-kit';
import { UserPlus, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { FriendsTabsBarProps } from './FriendsTabsBar.types';

import s from '../../FriendsPanel.module.scss';

export const FriendsTabsBar = ({
  friendsCount,
  incomingCount,
  isAddActive,
  onAddFriend
}: FriendsTabsBarProps) => {
  const t = useTranslations('friends');

  return (
    <div className={s.bar}>
      <span className={s.barTitle}>
        <Users aria-hidden className={s.barIcon} />
        {t('title')}
      </span>

      <span aria-hidden className={s.barDivider} />

      <TabsList className={s.tabsList}>
        <TabsTrigger value='online'>{t('onlineTab')}</TabsTrigger>
        <TabsTrigger value='all'>
          {t('allTab')}
          {friendsCount > 0 && <span className={s.count}>{friendsCount}</span>}
        </TabsTrigger>
        <TabsTrigger value='pending'>
          {t('requestsTab')}
          {incomingCount > 0 && <span className={s.badge}>{incomingCount}</span>}
        </TabsTrigger>
        <TabsTrigger value='developers'>{t('developersTab')}</TabsTrigger>
      </TabsList>

      <Button
        aria-label={t('addFriend')}
        className={s.addButton}
        size='sm'
        variant={isAddActive ? 'default' : 'ghost'}
        onClick={onAddFriend}
      >
        <UserPlus aria-hidden />
        <span className={s.addLabel}>{t('addFriend')}</span>
      </Button>
    </div>
  );
};
