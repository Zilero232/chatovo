import { useNavigate } from '@tanstack/react-router';
import { useEffect, useEffectEvent } from 'react';

import { useCurrentUser } from '@/entities/auth/user';
import { ROUTES } from '@/shared/constants';

export const useAdminGuard = () => {
  const navigate = useNavigate();

  const { isAdmin, isLoading } = useCurrentUser();

  const isDenied = !isLoading && !isAdmin;

  const redirectToLobby = useEffectEvent(() => navigate({ to: ROUTES.lobby, replace: true }));

  useEffect(() => {
    if (isDenied) {
      redirectToLobby();
    }
  }, [isDenied]);

  return { isDenied, isLoading };
};
