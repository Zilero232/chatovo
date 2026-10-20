import type { ContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps, ReactNode } from 'react';

export type ContextMenuProps = {
  children?: ReactNode;
};

export type ContextMenuTriggerProps = ComponentProps<typeof ContextMenu.Trigger>;

export type ContextMenuItemProps = Omit<ComponentProps<typeof ContextMenu.Item>, 'onSelect'> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  onSelect?: () => void;
};

export type ContextMenuLabelProps = ComponentProps<typeof ContextMenu.GroupLabel> & {
  inset?: boolean;
};

export type ContextMenuContentProps = {
  children?: ReactNode;
  className?: string;
};

export type ContextMenuGroupProps = ComponentProps<typeof ContextMenu.Group>;

export type ContextMenuSeparatorProps = ComponentProps<typeof ContextMenu.Separator>;
