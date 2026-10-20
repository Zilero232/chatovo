'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

import type { CheckboxProps } from './Checkbox.types';

import s from './Checkbox.module.scss';

const Checkbox = ({ className, checked, onCheckedChange, ...props }: CheckboxProps) => (
  <BaseCheckbox.Root
    checked={checked}
    className={clsx(s.root, className)}
    data-slot='checkbox'
    onCheckedChange={onCheckedChange}
    {...props}
  >
    <BaseCheckbox.Indicator className={s.indicator} data-slot='checkbox-indicator'>
      <Check className={s.icon} />
    </BaseCheckbox.Indicator>
  </BaseCheckbox.Root>
);

export { Checkbox };
