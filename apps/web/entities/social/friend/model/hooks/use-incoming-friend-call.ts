'use client';

import { useQuery } from '@tanstack/react-query';

import { getIncomingFriendCall } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useIncomingFriendCall = (enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.friendCallIncoming(),
    queryFn: getIncomingFriendCall,
    enabled,
    staleTime: Number.POSITIVE_INFINITY
  });
