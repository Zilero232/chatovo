import type { Popover } from '@base-ui/react/popover';
import type { ComponentProps, ReactNode, RefObject } from 'react';

import type { ButtonProps } from '../Button';

export type PopoverProps = Omit<ComponentProps<typeof Popover.Root>, 'children' | 'open'> & {
  open?: boolean;
  children?: ReactNode;
};

export type PopoverTriggerProps = ButtonProps;

export type PopoverContentProps = {
  align?: ComponentProps<typeof Popover.Positioner>['align'];
  children?: ReactNode;
  className?: string;
  initialFocus?: ComponentProps<typeof Popover.Popup>['initialFocus'];
  isOpen?: boolean;
  side?: ComponentProps<typeof Popover.Positioner>['side'];
  sideOffset?: number;
  triggerRef?: RefObject<HTMLElement | null>;
  onOpenChange?: (open: boolean) => void;
};

export type PopoverAnchorProps = ComponentProps<'div'>;

export type PopoverHeaderProps = ComponentProps<'div'>;

export type PopoverTitleProps = ComponentProps<'h2'>;

export type PopoverDescriptionProps = ComponentProps<'p'>;
