'use client';

import { AppSplash } from '@chatovo/ui-kit';

import type { AdminGuardProps } from './AdminGuard.types';

import { useAdminGuard } from '../../../model/hooks';

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { isDenied, isLoading } = useAdminGuard();

  if (isLoading || isDenied) {
    return <AppSplash />;
  }

  return children;
};
