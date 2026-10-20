'use client';

import { Menu } from '@base-ui/react/menu';
import { clsx } from 'clsx';
import { CircleIcon } from 'lucide-react';

import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuItemProps,
  DropdownMenuRadioItemProps
} from '../../DropdownMenu.types';

import s from '../../DropdownMenu.module.scss';

export const DropdownMenuItem = ({
  className,
  inset,
  variant = 'default',
  onSelect,
  onClick,
  ...props
}: DropdownMenuItemProps) => (
  <Menu.Item
    className={clsx(s.item, className)}
    data-inset={inset}
    data-slot='dropdown-menu-item'
    data-variant={variant}
    onClick={(event) => {
      onSelect?.();
      onClick?.(event);
    }}
    {...props}
  />
);

export const DropdownMenuCheckboxItem = ({
  className,
  children,
  ...props
}: DropdownMenuCheckboxItemProps) => (
  <Menu.CheckboxItem
    className={clsx(s.item, s.checkboxItem, className)}
    data-slot='dropdown-menu-checkbox-item'
    {...props}
  >
    {children}
  </Menu.CheckboxItem>
);

export const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps) => (
  <Menu.RadioItem
    className={clsx(s.radioItem, className)}
    data-slot='dropdown-menu-radio-item'
    {...props}
  >
    <Menu.RadioItemIndicator className={s.itemIndicator}>
      <CircleIcon className={s.radioDot} />
    </Menu.RadioItemIndicator>
    {children}
  </Menu.RadioItem>
);
