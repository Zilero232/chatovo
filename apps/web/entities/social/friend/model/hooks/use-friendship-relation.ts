'use client';

import { useQuery } from '@tanstack/react-query';

import { getFriendshipRelation } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useFriendshipRelation = (userId: string, enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.friendshipRelation(userId),
    queryFn: () => getFriendshipRelation(userId),
    enabled: enabled && userId.length > 0
  });
