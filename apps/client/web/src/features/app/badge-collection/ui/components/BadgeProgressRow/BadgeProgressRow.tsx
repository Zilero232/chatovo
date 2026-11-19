import { useTranslations } from 'use-intl';

import { BadgeIcon, BadgeProgress } from '@/entities/app/badges';

import type { BadgeProgressRowProps } from './BadgeProgressRow.types';

import s from '../../BadgeCollection.module.scss';

export const BadgeProgressRow = ({ id, tier, progress }: BadgeProgressRowProps) => {
  const t = useTranslations('badges');

  const { percent, remaining, nextTier } = progress;
  const label = nextTier
    ? t('remaining', { left: t(`items.${id}.unit`, { count: remaining }) })
    : t('maxed');

  return (
    <div className={s.progressRow}>
      <BadgeIcon id={id} size='sm' tier={tier} />

      <div className={s.progressBody}>
        <span className={s.progressLabel}>{label}</span>
        <BadgeProgress id={id} tier={nextTier ?? tier} value={percent} />
      </div>

      <BadgeIcon className={s.progressNext} id={id} size='sm' tier={nextTier ?? tier} />
    </div>
  );
};
