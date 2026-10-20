import type { Dialog } from '@base-ui/react/dialog';
import type { ComponentProps, ReactNode } from 'react';

export type SheetSide = 'bottom' | 'left' | 'right' | 'top';

export type SheetProps = Omit<ComponentProps<typeof Dialog.Root>, 'children' | 'onOpenChange'> & {
  className?: string;
  trigger?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

export type SheetContentProps = Omit<ComponentProps<typeof Dialog.Popup>, 'className'> & {
  className?: string;
  side?: SheetSide;
  showCloseButton?: boolean;
  modalClassName?: string;
  children?: ReactNode;
};

export type SheetTitleProps = ComponentProps<typeof Dialog.Title>;

export type SheetDescriptionProps = ComponentProps<typeof Dialog.Description>;
