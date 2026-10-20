import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { getDateDivider } from '@/shared/lib';

import type { DateDividerProps } from './DateDivider.types';

import s from './DateDivider.module.scss';

export const DateDivider = ({ timestamp }: DateDividerProps) => {
  const t = useTranslations('chat');

  const label = match(getDateDivider(timestamp))
    .with({ kind: 'today' }, () => t('today'))
    .with({ kind: 'yesterday' }, () => t('yesterday'))
    .with({ kind: 'date' }, ({ label }) => label)
    .exhaustive();

  return (
    <div className={s.root}>
      <span className={s.label}>{label}</span>
    </div>
  );
};
