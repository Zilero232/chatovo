import { useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';
import { isNonNullish } from 'remeda';

import { getShopOrder } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

const POLL_INTERVAL_MS = secondsToMilliseconds(3);

export const useShopOrder = (orderId: string | null) =>
  useQuery({
    queryKey: QUERY_KEYS.shopOrder(orderId ?? ''),
    queryFn: () => getShopOrder(orderId as string),
    enabled: isNonNullish(orderId),
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? POLL_INTERVAL_MS : false),
    refetchOnWindowFocus: true
  });
