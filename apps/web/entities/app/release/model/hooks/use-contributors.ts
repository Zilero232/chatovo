'use client';

import { useQuery } from '@tanstack/react-query';
import { hoursToMilliseconds } from 'date-fns';

import { listContributors } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useContributors = () =>
  useQuery({
    queryKey: QUERY_KEYS.contributors(),
    queryFn: listContributors,
    staleTime: hoursToMilliseconds(6),
    gcTime: hoursToMilliseconds(12),
    refetchOnWindowFocus: false
  });
