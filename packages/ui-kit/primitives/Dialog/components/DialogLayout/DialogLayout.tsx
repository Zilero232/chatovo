'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';
import { Lightbulb } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { DialogFooterProps, DialogHeaderProps, DialogHintProps } from '../../Dialog.types';

import { Button } from '../../../Button';

import s from '../../Dialog.module.scss';

export const DialogHeader = ({
  className,
  icon,
  tone = 'violet',
  children,
  ...props
}: DialogHeaderProps) => (
  <div
    className={clsx(s.header, icon && s.headerWithIcon, className)}
    data-slot='dialog-header'
    {...props}
  >
    {icon && (
      <span aria-hidden className={s.headerIcon} data-tone={tone}>
        {icon}
      </span>
    )}
    <div className={s.headerText}>{children}</div>
  </div>
);

export const DialogHint = ({ className, icon, children, ...props }: DialogHintProps) => (
  <div className={clsx(s.hint, className)} data-slot='dialog-hint' {...props}>
    <span aria-hidden className={s.hintIcon}>
      {icon ?? <Lightbulb />}
    </span>
    <span className={s.hintText}>{children}</span>
  </div>
);

export const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps) => {
  const t = useTranslations('ui');

  return (
    <div className={clsx(s.footer, className)} data-slot='dialog-footer' {...props}>
      {children}
      {showCloseButton && (
        <BaseDialog.Close render={<Button variant='outline' />}>{t('close')}</BaseDialog.Close>
      )}
    </div>
  );
};
