'use client';

import type { AdminReportQuery } from '@chatovo/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

import { listAdminReports } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useAdminReports = (query: AdminReportQuery, enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.adminReports(query),
    queryFn: () => listAdminReports(query),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: secondsToMilliseconds(15)
  });
