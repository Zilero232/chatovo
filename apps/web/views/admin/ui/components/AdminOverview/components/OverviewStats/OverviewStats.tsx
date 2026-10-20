'use client';

import { Ban, DoorOpen, Flag, Lock, MessageSquare, Radio, ShieldCheck, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { OverviewStatsProps } from './OverviewStats.types';

import { StatCard } from '../../../StatCard/StatCard';
import { StatGroup } from '../StatGroup/StatGroup';

import s from './OverviewStats.module.scss';

export const OverviewStats = ({ stats }: OverviewStatsProps) => {
  const t = useTranslations('admin');

  return (
    <div className={s.root}>
      <StatGroup title={t('stats.groupPeople')}>
        <StatCard
          hint={t('stats.newTodayHint', { count: stats.users.newToday })}
          icon={Users}
          label={t('stats.users')}
          tone='brand'
          value={stats.users.total}
        />
        <StatCard
          icon={Radio}
          label={t('stats.online')}
          tone='success'
          value={stats.users.online}
        />
        <StatCard icon={Ban} label={t('stats.blocked')} tone='danger' value={stats.users.blocked} />
        <StatCard icon={ShieldCheck} label={t('stats.admins')} value={stats.users.admins} />
      </StatGroup>

      <StatGroup title={t('stats.groupRooms')}>
        <StatCard
          hint={t('stats.roomsLiveHint', { count: stats.rooms.liveNow })}
          icon={DoorOpen}
          label={t('stats.rooms')}
          tone='brand'
          value={stats.rooms.total}
        />
        <StatCard icon={Lock} label={t('stats.roomsPrivate')} value={stats.rooms.private} />
      </StatGroup>

      <StatGroup title={t('stats.groupActivity')}>
        <StatCard
          hint={t('stats.messagesTodayHint', { count: stats.messages.today })}
          icon={MessageSquare}
          label={t('stats.messages')}
          value={stats.messages.total}
        />
        <StatCard
          icon={Flag}
          label={t('stats.reportsPending')}
          tone={stats.reports.pending > 0 ? 'danger' : 'default'}
          value={stats.reports.pending}
        />
      </StatGroup>
    </div>
  );
};
