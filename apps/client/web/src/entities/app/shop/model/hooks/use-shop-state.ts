import { useQuery } from '@tanstack/react-query';
import { minutesToMilliseconds } from 'date-fns';

import { getShopState } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useShopState = () =>
  useQuery({
    queryKey: QUERY_KEYS.shopState(),
    queryFn: getShopState,
    staleTime: minutesToMilliseconds(5)
  });
