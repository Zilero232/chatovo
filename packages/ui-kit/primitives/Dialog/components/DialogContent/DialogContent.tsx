'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';
import { useEffect } from 'react';

import type { DialogContentProps } from '../../Dialog.types';

import { OverlayCloseButton } from '../../../../components/OverlayCloseButton';
import { useDialogOverlay } from '../../dialog-overlay-context';

import s from '../../Dialog.module.scss';

export const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  overlayClassName,
  popupClassName,
  ...props
}: DialogContentProps) => {
  const overlayContext = useDialogOverlay();

  useEffect(() => {
    overlayContext?.setOverlayClassName(overlayClassName);

    return () => {
      overlayContext?.setOverlayClassName(undefined);
    };
  }, [overlayClassName, overlayContext]);

  return (
    <BaseDialog.Popup
      className={clsx(s.modal, popupClassName)}
      data-slot='dialog-portal'
      {...props}
    >
      <div
        className={clsx('glass-overlay', 'max-h-dvh-safe', s.content, className)}
        data-slot='dialog-content'
      >
        {children}
        {showCloseButton && (
          <BaseDialog.Close render={<OverlayCloseButton className={s.close} />} />
        )}
      </div>
    </BaseDialog.Popup>
  );
};
