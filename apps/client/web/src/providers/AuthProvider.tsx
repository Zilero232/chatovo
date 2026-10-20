import type { ReactNode } from 'react';

import { AppSplash } from '@chatovo/ui-kit';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useCurrentUser } from '@/entities/auth/user';
import { ROUTES } from '@/shared/constants';
import { isOpenRoute, isPublicRoute } from '@/shared/lib';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('splash');
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });

  const { isLoading, isAuthenticated } = useCurrentUser();

  const hasResolvedRef = useRef(false);

  if (!isLoading) {
    hasResolvedRef.current = true;
  }

  const isInitialLoading = isLoading && !hasResolvedRef.current;

  const isGuestZone = isPublicRoute(pathname);
  const isOpenZone = isOpenRoute(pathname);

  const target = match({ isGuestZone, isOpenZone, isInitialLoading, isAuthenticated })
    .with({ isInitialLoading: true }, () => null)
    .with({ isOpenZone: true }, () => null)
    .with({ isGuestZone: true, isAuthenticated: true }, () => ROUTES.lobby)
    .with({ isGuestZone: false, isAuthenticated: false }, () => ROUTES.auth)
    .otherwise(() => null);

  useEffect(() => {
    if (target) {
      navigate({ to: target, replace: true });
    }
    // eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on target change; navigate is a stable ref
  }, [target]);

  if (isInitialLoading || target) {
    return <AppSplash message={t('signingIn')} />;
  }

  return children;
};
