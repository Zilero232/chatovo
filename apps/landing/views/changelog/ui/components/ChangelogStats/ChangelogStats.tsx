import { getTranslations } from 'next-intl/server';

import type { ChangelogStatsProps } from './ChangelogStats.types';

import s from '../../ChangelogPage.module.scss';

export const ChangelogStats = async ({ locale, summary }: ChangelogStatsProps) => {
  const t = await getTranslations({ locale, namespace: 'changelog.stats' });

  const items = [
    { key: 'releases', label: t('releases'), value: String(summary.releases) },
    { key: 'months', label: t('months'), value: String(summary.months) },
    { key: 'current', label: t('current'), value: summary.current }
  ];

  return (
    <dl className={s.stats}>
      {items.map(({ key, label, value }) => (
        <div key={key} className={s.stat}>
          <dt className={s.statLabel}>{label}</dt>
          <dd className={s.statValue}>{value}</dd>
        </div>
      ))}
    </dl>
  );
};
