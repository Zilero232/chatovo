'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';

import type { DialogDescriptionProps, DialogTitleProps } from '../../Dialog.types';

import s from '../../Dialog.module.scss';

export const DialogTitle = ({ className, children, ...props }: DialogTitleProps) => (
  <BaseDialog.Title className={clsx(s.title, className)} data-slot='dialog-title' {...props}>
    {children}
  </BaseDialog.Title>
);

export const DialogDescription = ({ className, children, ...props }: DialogDescriptionProps) => (
  <BaseDialog.Description
    className={clsx(s.description, className)}
    data-slot='dialog-description'
    {...props}
  >
    {children}
  </BaseDialog.Description>
);
