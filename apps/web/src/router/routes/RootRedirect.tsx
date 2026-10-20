import { AppSplash } from '@chatovo/ui-kit';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { ROUTES } from '@/shared/constants';

export const RootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    void navigate({ to: ROUTES.lobby, replace: true });
    // eslint-disable-next-line react/exhaustive-deps -- one redirect on mount; navigate is a stable ref
  }, []);

  return <AppSplash />;
};
