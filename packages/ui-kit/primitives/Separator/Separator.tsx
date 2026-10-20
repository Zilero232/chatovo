'use client';

import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { clsx } from 'clsx';

import type { SeparatorProps } from './Separator.types';

import s from './Separator.module.scss';

const Separator = ({ className, orientation = 'horizontal', ...props }: SeparatorProps) => (
  <BaseSeparator
    className={clsx(s.root, className)}
    data-slot='separator'
    orientation={orientation}
    {...props}
  />
);

export { Separator };
