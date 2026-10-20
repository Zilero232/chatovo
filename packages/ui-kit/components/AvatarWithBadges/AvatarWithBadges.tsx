import { clsx } from 'clsx';

import type { AvatarWithBadgesProps } from './AvatarWithBadges.types';

import s from './AvatarWithBadges.module.scss';

export const AvatarWithBadges = ({
  children,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  className
}: AvatarWithBadgesProps) => (
  <div className={clsx(s.root, className)}>
    {children}
    {topLeft}
    {topRight}
    {bottomLeft}
    {bottomRight}
  </div>
);
