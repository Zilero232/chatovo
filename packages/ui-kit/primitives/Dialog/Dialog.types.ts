import type { Dialog } from '@base-ui/react/dialog';
import type { ComponentProps, ReactNode } from 'react';

export type DialogProps = Omit<ComponentProps<typeof Dialog.Root>, 'children' | 'onOpenChange'> & {
  className?: string;
  trigger?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

export type DialogContentProps = Omit<ComponentProps<typeof Dialog.Popup>, 'className'> & {
  className?: string;
  showCloseButton?: boolean;
  overlayClassName?: string;
  popupClassName?: string;
  children?: ReactNode;
};

export type DialogHeaderTone = 'cyan' | 'destructive' | 'fuchsia' | 'violet';

export type DialogHeaderProps = ComponentProps<'div'> & {
  icon?: ReactNode;
  tone?: DialogHeaderTone;
};

export type DialogHintProps = ComponentProps<'div'> & {
  icon?: ReactNode;
};

export type DialogFooterProps = ComponentProps<'div'> & {
  showCloseButton?: boolean;
};

export type DialogTitleProps = ComponentProps<typeof Dialog.Title>;

export type DialogDescriptionProps = ComponentProps<typeof Dialog.Description>;
