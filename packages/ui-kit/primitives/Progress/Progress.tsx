'use client';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import { clsx } from 'clsx';

import type { ProgressProps } from './Progress.types';

import s from './Progress.module.scss';

const Progress = ({ className, value, ...props }: ProgressProps) => (
  <BaseProgress.Root data-slot='progress' value={value} {...props}>
    <BaseProgress.Track className={clsx(s.root, className)}>
      <BaseProgress.Indicator className={s.indicator} data-slot='progress-indicator' />
    </BaseProgress.Track>
  </BaseProgress.Root>
);

export { Progress };
