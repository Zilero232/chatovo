import { toRelease } from '@chatovo/schemas';
import { useQuery } from '@tanstack/react-query';
import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';

import { getAppDownloads } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useRelease = (enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.release(),
    enabled,
    retry: 1,
    staleTime: minutesToMilliseconds(30),
    gcTime: hoursToMilliseconds(2),
    refetchOnWindowFocus: false,
    queryFn: async () => toRelease(await getAppDownloads())
  });
