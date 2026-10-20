import { USER_ROLE } from '@chatovo/schemas';
import { useQuery } from '@tanstack/react-query';
import { minutesToMilliseconds } from 'date-fns';
import { isNonNullish } from 'remeda';

import { authClient, getAuthToken, getUserProfile } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { firstNonEmpty, stripEmailDomain } from '@/shared/lib';

import type { UserRole } from '../types';

export const useCurrentUser = () => {
  const { data: session, isPending, error: sessionError } = authClient.useSession();

  const user = isNonNullish(sessionError) ? null : (session?.user ?? null);
  const userId = user?.id ?? null;
  const hasToken = getAuthToken().length > 0;

  const { data: profile } = useQuery({
    queryKey: QUERY_KEYS.userProfile(userId ?? ''),
    queryFn: () => getUserProfile(userId as string),
    enabled: isNonNullish(userId) && hasToken,
    staleTime: minutesToMilliseconds(5)
  });

  const role: UserRole = user?.role === USER_ROLE.admin ? USER_ROLE.admin : USER_ROLE.user;

  const displayName = stripEmailDomain(firstNonEmpty(profile?.name, user?.name)) ?? 'you';
  const initial = displayName.charAt(0).toUpperCase();

  return {
    user,
    role,
    session: user ? (session ?? null) : null,
    isLoading: isPending,
    displayName,
    initial,
    isAdmin: role === USER_ROLE.admin,
    avatarUrl: firstNonEmpty(profile?.avatarUrl, user?.image),
    verified: profile?.verified ?? user?.verified ?? false,
    developer: profile?.developer ?? false,
    friendTag: firstNonEmpty(profile?.friendTag),
    emailVerified: user?.emailVerified ?? false,
    profileUrl: firstNonEmpty(profile?.profileUrl),
    bannerColor: firstNonEmpty(profile?.bannerColor),
    bio: firstNonEmpty(profile?.bio),
    isAuthenticated: isNonNullish(user)
  };
};
