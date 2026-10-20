'use client';

import { useQuery } from '@tanstack/react-query';
import { hoursToMilliseconds } from 'date-fns';

import { listDevelopers } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useDevelopers = (enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.developers(),
    queryFn: listDevelopers,
    enabled,
    staleTime: hoursToMilliseconds(1),
    gcTime: hoursToMilliseconds(2),
    refetchOnWindowFocus: false
  });
