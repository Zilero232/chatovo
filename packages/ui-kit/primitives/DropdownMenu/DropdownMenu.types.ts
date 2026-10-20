import type { Menu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';

import type { ButtonProps } from '../Button';

export type DropdownMenuProps = ComponentProps<typeof Menu.Root>;

export type DropdownMenuTriggerProps = ButtonProps;

export type DropdownMenuItemProps = Omit<ComponentProps<typeof Menu.Item>, 'onSelect'> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  onSelect?: () => void;
};

export type DropdownMenuLabelProps = ComponentProps<typeof Menu.GroupLabel> & {
  inset?: boolean;
};

export type DropdownMenuContentProps = Omit<ComponentProps<typeof Menu.Popup>, 'className'> & {
  align?: ComponentProps<typeof Menu.Positioner>['align'];
  side?: ComponentProps<typeof Menu.Positioner>['side'];
  sideOffset?: number;
  className?: string;
};

export type DropdownMenuCheckboxItemProps = ComponentProps<typeof Menu.CheckboxItem>;

export type DropdownMenuRadioGroupProps = ComponentProps<typeof Menu.RadioGroup>;

export type DropdownMenuRadioItemProps = ComponentProps<typeof Menu.RadioItem>;

export type DropdownMenuGroupProps = ComponentProps<typeof Menu.Group>;
