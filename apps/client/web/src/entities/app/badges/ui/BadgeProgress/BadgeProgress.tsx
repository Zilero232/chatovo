import { Progress } from '@chatovo/ui-kit';
import { clsx } from 'clsx';

import type { BadgeProgressProps } from './BadgeProgress.types';

import s from './BadgeProgress.module.scss';

export const BadgeProgress = ({ id, tier, value, className }: BadgeProgressProps) => (
  <div className={clsx(s.root, className)} data-badge={id} data-tier={tier}>
    <Progress className={s.track} value={value} />
  </div>
);
