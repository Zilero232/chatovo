import { clsx } from 'clsx';

import type { BadgeIconProps } from './BadgeIcon.types';

import { BADGE_ICONS } from '../../config';

import s from './BadgeIcon.module.scss';

export const BadgeIcon = ({ id, tier, size = 'md', className }: BadgeIconProps) => {
  const Icon = BADGE_ICONS[id];

  return (
    <span aria-hidden className={clsx(s.root, s[size], className)} data-badge={id} data-tier={tier}>
      <Icon className={s.icon} />
    </span>
  );
};
