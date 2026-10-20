'use client';

import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ActivityOnlineProps } from './ActivityOnline.types';

import { ActivityOnlineRow } from '../ActivityOnlineRow/ActivityOnlineRow';

import s from './ActivityOnline.module.scss';

export const ActivityOnline = ({ entries }: ActivityOnlineProps) => {
  const t = useTranslations('channels.activity');

  return (
    <div className={s.root}>
      <p className={s.label}>
        <Users className={s.icon} />
        {t('available', { count: entries.length })}
      </p>

      <div className={s.rows}>
        {entries.map((entry) => (
          <ActivityOnlineRow key={entry.friendshipId} user={entry.user} />
        ))}
      </div>
    </div>
  );
};
