'use client';

import type { AdminRoomQuery } from '@chatovo/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

import { listAdminRooms } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useAdminRooms = (query: AdminRoomQuery, enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.adminRooms(query),
    queryFn: () => listAdminRooms(query),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: secondsToMilliseconds(15)
  });
