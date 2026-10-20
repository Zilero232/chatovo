'use client';

import { clsx } from 'clsx';

import type { AvatarStatusDotProps } from './AvatarStatusDot.types';

import s from './AvatarStatusDot.module.scss';

const cornerClass = {
  'bottom-left': s.cornerBottomLeft,
  'bottom-right': s.cornerBottomRight,
  'top-left': s.cornerTopLeft
} as const;

const toneClass = {
  danger: s.toneDanger,
  gold: s.toneGold
} as const;

export const AvatarStatusDot = ({
  corner,
  icon: Icon,
  label,
  tone,
  className
}: AvatarStatusDotProps) => (
  <span
    aria-label={label}
    className={clsx(s.root, cornerClass[corner], className)}
    role='img'
    title={label}
  >
    <Icon className={clsx(s.icon, toneClass[tone])} />
  </span>
);
