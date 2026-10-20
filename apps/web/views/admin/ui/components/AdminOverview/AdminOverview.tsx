import type { AdminStats } from '@chatovo/schemas';

import { CenteredState, Spinner } from '@chatovo/ui-kit';
import { ChartNoAxesColumn } from 'lucide-react';
import { isNonNullish } from 'remeda';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useAdminStats } from '@/entities/app/admin';

import type { AdminTabProps } from '../../AdminPage.types';

import { BreakdownChart } from '../BreakdownChart/BreakdownChart';
import { TrendChart } from '../TrendChart/TrendChart';
import { OverviewStats } from './components';

import s from './AdminOverview.module.scss';

export const AdminOverview = ({ enabled }: AdminTabProps) => {
  const t = useTranslations('admin');
  const { data, isPending } = useAdminStats(enabled);

  const renderStats = (stats: AdminStats) => (
    <div className={s.root}>
      <OverviewStats stats={stats} />

      <div className={s.charts}>
        <TrendChart hint={t('stats.chartHint')} points={stats.signups} title={t('stats.signups')} />
        <TrendChart
          color='mint'
          hint={t('stats.chartHint')}
          points={stats.messagesSeries}
          title={t('stats.messagesSeries')}
        />
      </div>

      <BreakdownChart
        slices={[
          { label: t('stats.roomsGroup'), value: stats.rooms.group },
          { label: t('stats.roomsDm'), value: stats.rooms.dm },
          { label: t('stats.roomsPrivate'), value: stats.rooms.private },
          { label: t('stats.roomsLive'), value: stats.rooms.liveNow }
        ]}
        hint={t('stats.breakdownHint')}
        title={t('stats.roomsBreakdown')}
      />
    </div>
  );

  return match({ isPending, data })
    .with({ isPending: true }, () => <Spinner className={s.spinner} />)
    .with({ data: P.when(isNonNullish) }, ({ data: stats }) => renderStats(stats))
    .otherwise(() => <CenteredState icon={<ChartNoAxesColumn />} title={t('reports.empty')} />);
};
