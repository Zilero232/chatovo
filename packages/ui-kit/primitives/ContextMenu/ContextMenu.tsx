'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { clsx } from 'clsx';

import type {
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuProps,
  ContextMenuSeparatorProps,
  ContextMenuTriggerProps
} from './ContextMenu.types';

import s from './ContextMenu.module.scss';

export const ContextMenu = ({ children }: ContextMenuProps) => (
  <BaseContextMenu.Root>{children}</BaseContextMenu.Root>
);

export const ContextMenuTrigger = ({ className, children, ...props }: ContextMenuTriggerProps) => (
  <BaseContextMenu.Trigger className={className} data-slot='context-menu-trigger' {...props}>
    {children}
  </BaseContextMenu.Trigger>
);

export const ContextMenuContent = ({ className, children }: ContextMenuContentProps) => (
  <BaseContextMenu.Portal>
    <BaseContextMenu.Positioner className={s.positioner}>
      <BaseContextMenu.Popup className={clsx(s.popup, className)} data-slot='context-menu-content'>
        {children}
      </BaseContextMenu.Popup>
    </BaseContextMenu.Positioner>
  </BaseContextMenu.Portal>
);

export const ContextMenuItem = ({
  className,
  inset,
  variant = 'default',
  onSelect,
  onClick,
  ...props
}: ContextMenuItemProps) => (
  <BaseContextMenu.Item
    className={clsx(s.item, className)}
    data-inset={inset}
    data-slot='context-menu-item'
    data-variant={variant}
    onClick={(event) => {
      onSelect?.();
      onClick?.(event);
    }}
    {...props}
  />
);

export const ContextMenuGroup = ({ className, children, ...props }: ContextMenuGroupProps) => (
  <BaseContextMenu.Group className={className} data-slot='context-menu-group' {...props}>
    {children}
  </BaseContextMenu.Group>
);

export const ContextMenuLabel = ({ className, inset, ...props }: ContextMenuLabelProps) => (
  <BaseContextMenu.GroupLabel
    className={clsx(s.label, className)}
    data-inset={inset}
    data-slot='context-menu-label'
    {...props}
  />
);

export const ContextMenuSeparator = ({ className, ...props }: ContextMenuSeparatorProps) => (
  <BaseContextMenu.Separator
    className={clsx(s.separator, className)}
    data-slot='context-menu-separator'
    {...props}
  />
);
