'use client';

import { useRouter } from 'next/navigation';

import { authClient, queryClient } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { appEvents } from '@/shared/lib';

export const SessionExpiryWatcher = () => {
  const router = useRouter();

  appEvents.on.sessionExpired(() => {
    void authClient.getSession({ query: { disableCookieCache: true } });

    queryClient.clear();
    router.replace(ROUTES.auth);
  });

  return null;
};
