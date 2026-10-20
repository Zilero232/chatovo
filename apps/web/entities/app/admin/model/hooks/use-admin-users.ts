'use client';

import type { AdminUserQuery } from '@chatovo/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

import { listAdminUsers } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useAdminUsers = (query: AdminUserQuery, enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.adminUsers(query),
    queryFn: () => listAdminUsers(query),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: secondsToMilliseconds(15)
  });
