'use client';

import { useCurrentUser } from '@/entities/auth/user';
import { isTauriMobile } from '@/shared/lib';

import { usePushRegistration } from '../../../model/hooks';

export const PushRegistration = () => {
  const { isAuthenticated } = useCurrentUser();

  usePushRegistration(isTauriMobile() && isAuthenticated);

  return null;
};
