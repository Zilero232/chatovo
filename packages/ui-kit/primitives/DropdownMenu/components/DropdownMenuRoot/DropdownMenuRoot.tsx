'use client';

import { Menu } from '@base-ui/react/menu';
import { clsx } from 'clsx';

import type {
  DropdownMenuContentProps,
  DropdownMenuProps,
  DropdownMenuTriggerProps
} from '../../DropdownMenu.types';

import { Button } from '../../../Button';

import s from '../../DropdownMenu.module.scss';

export const DropdownMenu = ({ children, ...props }: DropdownMenuProps) => (
  <Menu.Root data-slot='dropdown-menu' {...props}>
    {children}
  </Menu.Root>
);

export const DropdownMenuTrigger = ({
  className,
  children,
  ...props
}: DropdownMenuTriggerProps) => (
  <Menu.Trigger
    data-slot='dropdown-menu-trigger'
    render={<Button className={className} {...props} />}
  >
    {children}
  </Menu.Trigger>
);

export const DropdownMenuContent = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
  ...props
}: DropdownMenuContentProps) => (
  <Menu.Portal>
    <Menu.Positioner align={align} className={s.positioner} side={side} sideOffset={sideOffset}>
      <Menu.Popup
        className={clsx('glass-overlay', s.popup, className)}
        data-slot='dropdown-menu-content'
        {...props}
      >
        {children}
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
);
