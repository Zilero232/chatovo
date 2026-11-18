import { useEffect, useEffectEvent } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useShopOrder } from '@/entities/app/shop';
import { queryClient } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { watchedOrderStoreApi } from '../../stores';

const TOAST_ID = 'shop-order';

const SETTLED_STATUSES = new Set(['succeeded', 'canceled', 'refunded']);

export const useWatchShopOrder = () => {
  const t = useTranslations('shop');

  const orderId = watchedOrderStoreApi.use((state) => state.orderId);
  const { data: order, isError } = useShopOrder(orderId);

  const status = order?.status;
  const isLost = isError && !order;

  const settle = useEffectEvent(() => {
    if (status === 'succeeded') {
      toast.success(t('paymentSucceeded'), { id: TOAST_ID });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shopState() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myBadges() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userBadgesRoot() });
    }

    if (status === 'canceled') {
      toast.error(t('paymentCanceled'), { id: TOAST_ID });
    }

    if (isLost) {
      toast.error(t('orderCheckFailed'), { id: TOAST_ID });
    }

    watchedOrderStoreApi.set({ orderId: null });
  });

  useEffect(() => {
    if ((status && SETTLED_STATUSES.has(status)) || isLost) {
      settle();
    }
  }, [status, isLost]);
};
