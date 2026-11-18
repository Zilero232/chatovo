import { SHOP_ORDER_QUERY_PARAM } from '@chatovo/schemas';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useEffectEvent } from 'react';

import { ROUTES } from '@/shared/constants';

import { watchedOrderStoreApi } from '../../../model/stores';

export const ShopOrderReturn = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const orderId = search[SHOP_ORDER_QUERY_PARAM];

  const watch = useEffectEvent((id: string) => {
    watchedOrderStoreApi.set({ orderId: id });
    navigate({ to: ROUTES.lobby, replace: true });
  });

  useEffect(() => {
    if (orderId) {
      watch(orderId);
    }
  }, [orderId]);

  return null;
};
