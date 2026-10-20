'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon
} from 'lucide-react';
import { Toaster as Sonner } from 'sonner';

import type { ToasterProps } from './Sonner.types';

import s from './Sonner.module.scss';

const MOBILE_TOAST_BREAKPOINT = '(max-width: 767px)';

const DESKTOP_TOAST_OFFSET = {
  top: 'var(--toast-offset-top)',
  right: 'var(--toast-offset-right)'
} as const;

const MOBILE_TOAST_OFFSET = {
  top: 'var(--toast-offset-top)',
  left: 'var(--toast-offset-left)',
  right: 'var(--toast-offset-right)'
} as const;

const Toaster = ({ ...props }: ToasterProps) => {
  const isMobile = useMediaQuery(MOBILE_TOAST_BREAKPOINT);

  return (
    <Sonner
      icons={{
        success: <CircleCheckIcon className={s.iconSize} />,
        info: <InfoIcon className={s.iconSize} />,
        warning: <TriangleAlertIcon className={s.iconSize} />,
        error: <OctagonXIcon className={s.iconSize} />,
        loading: <Loader2Icon className={clsx(s.iconSize, s.spin)} />
      }}
      toastOptions={{
        classNames: {
          toast: s.toast,
          title: s.title,
          description: s.description,
          icon: s.icon,
          success: s.success,
          error: s.error,
          warning: s.warning,
          info: s.info,
          loading: s.loading
        }
      }}
      className={clsx(s.toaster, 'group')}
      mobileOffset={MOBILE_TOAST_OFFSET}
      offset={isMobile ? MOBILE_TOAST_OFFSET : DESKTOP_TOAST_OFFSET}
      position='top-right'
      theme='dark'
      {...props}
    />
  );
};

export { Toaster };
