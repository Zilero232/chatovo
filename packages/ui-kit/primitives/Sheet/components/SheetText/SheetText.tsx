'use client';

import { Dialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';

import type { SheetDescriptionProps, SheetTitleProps } from '../../Sheet.types';

import s from '../../Sheet.module.scss';

export const SheetTitle = ({ className, children, ...props }: SheetTitleProps) => (
  <Dialog.Title className={clsx(s.title, className)} data-slot='sheet-title' {...props}>
    {children}
  </Dialog.Title>
);

export const SheetDescription = ({ className, children, ...props }: SheetDescriptionProps) => (
  <Dialog.Description
    className={clsx(s.description, className)}
    data-slot='sheet-description'
    {...props}
  >
    {children}
  </Dialog.Description>
);
