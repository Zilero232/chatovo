'use client';

import { useQuery } from '@tanstack/react-query';

import { getOutgoingFriendCall } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useOutgoingFriendCall = (enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.friendCallOutgoing(),
    queryFn: getOutgoingFriendCall,
    enabled,
    staleTime: Number.POSITIVE_INFINITY
  });
