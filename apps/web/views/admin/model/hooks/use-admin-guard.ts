'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useEffectEvent } from 'react';

import { useCurrentUser } from '@/entities/auth/user';
import { ROUTES } from '@/shared/constants';

export const useAdminGuard = () => {
  const router = useRouter();

  const { isAdmin, isLoading } = useCurrentUser();

  const isDenied = !isLoading && !isAdmin;

  const redirectToLobby = useEffectEvent(() => router.replace(ROUTES.lobby));

  useEffect(() => {
    if (isDenied) {
      redirectToLobby();
    }
  }, [isDenied]);

  return { isDenied, isLoading };
};
