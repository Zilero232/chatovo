import { useQuery } from '@tanstack/react-query';
import { minutesToMilliseconds } from 'date-fns';

import { getUserBadges } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useUserBadges = (userId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.userBadges(userId),
    queryFn: () => getUserBadges(userId),
    staleTime: minutesToMilliseconds(5)
  });
