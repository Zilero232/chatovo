import { useQuery } from '@tanstack/react-query';
import { minutesToMilliseconds } from 'date-fns';

import { getMyBadges } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useMyBadges = () =>
  useQuery({
    queryKey: QUERY_KEYS.myBadges(),
    queryFn: getMyBadges,
    staleTime: minutesToMilliseconds(5)
  });
