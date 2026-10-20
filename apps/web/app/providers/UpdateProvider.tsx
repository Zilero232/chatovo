'use client';

import type { ReactNode } from 'react';

import { UpdateBootstrap } from '@/features/app/check-app-update';
import { isTauriDesktop } from '@/shared/lib';

const isDev = process.env.NODE_ENV === 'development';

export const UpdateProvider = ({ children }: { children: ReactNode }) => {
  if (isDev || !isTauriDesktop()) {
    return children;
  }

  return <UpdateBootstrap>{children}</UpdateBootstrap>;
};
