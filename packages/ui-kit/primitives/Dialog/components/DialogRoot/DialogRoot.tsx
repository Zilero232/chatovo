'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';

import type { DialogProps } from '../../Dialog.types';

import { DialogOverlayProvider, useDialogOverlay } from '../../dialog-overlay-context';

import s from '../../Dialog.module.scss';

const DialogBackdrop = ({ className }: { className?: string }) => {
  const overlay = useDialogOverlay();

  return (
    <BaseDialog.Backdrop
      className={clsx(s.overlay, overlay?.overlayClassName, className)}
      data-slot='dialog'
    />
  );
};

export const Dialog = ({
  open,
  defaultOpen,
  onOpenChange,
  disablePointerDismissal,
  className,
  trigger,
  children,
  ...props
}: DialogProps) => (
  <DialogOverlayProvider>
    <BaseDialog.Root
      defaultOpen={defaultOpen}
      disablePointerDismissal={disablePointerDismissal}
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    >
      {trigger ? <BaseDialog.Trigger render={trigger as never} /> : null}

      <BaseDialog.Portal>
        <DialogBackdrop className={className} />
        {children}
      </BaseDialog.Portal>
    </BaseDialog.Root>
  </DialogOverlayProvider>
);
