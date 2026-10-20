import { useNavigate } from '@tanstack/react-router';

import { authClient, queryClient } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { appEvents } from '@/shared/lib';

export const SessionExpiryWatcher = () => {
  const navigate = useNavigate();

  appEvents.on.sessionExpired(() => {
    void authClient.getSession({ query: { disableCookieCache: true } });

    queryClient.clear();
    navigate({ to: ROUTES.auth, replace: true });
  });

  return null;
};
