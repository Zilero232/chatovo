'use client';

import { Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Code2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { DeveloperBadgeProps } from './DeveloperBadge.types';

import s from './DeveloperBadge.module.scss';

const sizeClass = {
  sm: s.sm,
  md: s.md
} as const;

export const DeveloperBadge = ({ size = 'sm', className }: DeveloperBadgeProps) => {
  const t = useTranslations('user');

  return (
    <Tooltip>
      <span
        aria-label={t('developer')}
        className={clsx(s.root, sizeClass[size], className)}
        role='img'
      >
        <Code2 aria-hidden className={s.icon} />
        DEV
      </span>
      <TooltipContent sideOffset={6}>{t('developerHint')}</TooltipContent>
    </Tooltip>
  );
};
