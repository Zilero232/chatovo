'use client';

import type { AdminUserMessageQuery } from '@chatovo/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

import { getAdminUserDetails, listAdminUserMessages } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useAdminUserDetails = (userId: string | null, enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.adminUserDetails(userId ?? ''),
    queryFn: () => getAdminUserDetails(userId as string),
    enabled: enabled && Boolean(userId),
    staleTime: secondsToMilliseconds(15)
  });

export const useAdminUserMessages = (
  userId: string | null,
  query: AdminUserMessageQuery,
  enabled = true
) =>
  useQuery({
    queryKey: QUERY_KEYS.adminUserMessages(userId ?? '', query),
    queryFn: () => listAdminUserMessages(userId as string, query),
    enabled: enabled && Boolean(userId),
    placeholderData: keepPreviousData,
    staleTime: secondsToMilliseconds(15)
  });
