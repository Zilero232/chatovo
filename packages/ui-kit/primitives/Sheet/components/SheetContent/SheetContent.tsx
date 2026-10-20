'use client';

import { Dialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

import type { SheetContentProps } from '../../Sheet.types';

import { SHEET_TRANSITION, sheetVariants, sideClass } from '../../Sheet.motion';

import s from '../../Sheet.module.scss';

export const SheetContent = ({
  className,
  modalClassName,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetContentProps) => (
  <Dialog.Popup
    key='sheet-popup'
    render={
      <motion.div
        animate='visible'
        exit='hidden'
        initial='hidden'
        transition={SHEET_TRANSITION}
        variants={sheetVariants(side)}
      />
    }
    className={clsx(s.modal, sideClass[side], modalClassName)}
    data-slot='sheet-portal'
    {...props}
  >
    <div className={clsx('glass-overlay', s.content, className)} data-slot='sheet-content'>
      {children}
      {showCloseButton && (
        <Dialog.Close className={s.close} data-slot='sheet-close'>
          <span aria-hidden>×</span>
        </Dialog.Close>
      )}
    </div>
  </Dialog.Popup>
);
