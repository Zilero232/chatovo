'use client';

import { useQuery } from '@tanstack/react-query';

import { listFriends } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useFriends = (enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.friends(),
    queryFn: listFriends,
    enabled,
    staleTime: Number.POSITIVE_INFINITY
  });
