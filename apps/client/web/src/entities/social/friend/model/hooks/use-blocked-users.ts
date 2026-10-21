import { useQuery } from '@tanstack/react-query';

import { listBlockedUsers } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useBlockedUsers = () =>
  useQuery({
    queryKey: QUERY_KEYS.blockedUsers(),
    queryFn: listBlockedUsers,
    staleTime: Number.POSITIVE_INFINITY
  });
