'use client';

import { Menu } from '@base-ui/react/menu';
import { clsx } from 'clsx';

import type {
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuRadioGroupProps
} from '../../DropdownMenu.types';

import s from '../../DropdownMenu.module.scss';

export const DropdownMenuRadioGroup = ({ children, ...props }: DropdownMenuRadioGroupProps) => (
  <Menu.RadioGroup data-slot='dropdown-menu-radio-group' {...props}>
    {children}
  </Menu.RadioGroup>
);

export const DropdownMenuGroup = ({ className, children, ...props }: DropdownMenuGroupProps) => (
  <Menu.Group className={className} data-slot='dropdown-menu-group' {...props}>
    {children}
  </Menu.Group>
);

export const DropdownMenuLabel = ({ className, inset, ...props }: DropdownMenuLabelProps) => (
  <Menu.GroupLabel
    className={clsx(s.label, className)}
    data-inset={inset}
    data-slot='dropdown-menu-label'
    {...props}
  />
);
