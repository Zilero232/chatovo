'use client';

import { useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

import { getAdminStats } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useAdminStats = (enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.adminStats(),
    queryFn: getAdminStats,
    enabled,
    staleTime: secondsToMilliseconds(30)
  });
