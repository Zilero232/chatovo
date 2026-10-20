'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { clsx } from 'clsx';

import type { SwitchProps } from './Switch.types';

import s from './Switch.module.scss';

const Switch = ({ className, checked, onCheckedChange, children, ...props }: SwitchProps) => (
  <BaseSwitch.Root
    checked={checked}
    className={clsx(s.root, className)}
    data-slot='switch'
    onCheckedChange={onCheckedChange}
    {...props}
  >
    <BaseSwitch.Thumb className={s.thumb} data-slot='switch-thumb' />
    {children}
  </BaseSwitch.Root>
);

export { Switch };
