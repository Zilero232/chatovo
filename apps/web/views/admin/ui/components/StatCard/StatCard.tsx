'use client';

import { Text } from '@chatovo/ui-kit';
import { clsx } from 'clsx';

import type { StatCardProps } from './StatCard.types';

import s from './StatCard.module.scss';

export const StatCard = ({ label, value, icon: Icon, hint, tone = 'default' }: StatCardProps) => (
  <article className={clsx(s.root, s[tone])}>
    <span className={s.iconWrap}>
      <Icon className={s.icon} />
    </span>

    <div className={s.body}>
      <Text truncate size='xs' tone='muted'>
        {label}
      </Text>

      <span className={s.value}>{value.toLocaleString()}</span>

      {hint && (
        <Text truncate size='xs' tone='muted'>
          {hint}
        </Text>
      )}
    </div>
  </article>
);
