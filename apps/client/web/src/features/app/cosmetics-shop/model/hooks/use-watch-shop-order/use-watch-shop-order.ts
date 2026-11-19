import type { ShopOrder } from '@chatovo/schemas';

import { secondsToMilliseconds } from 'date-fns';
import { useEffect, useEffectEvent } from 'react';
import { toast } from 'sonner';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useRealtimeMessage } from '@/entities/app/realtime';
import { useShopOrder } from '@/entities/app/shop';
import { queryClient } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { appEvents } from '@/shared/lib/app-bus';

import { useWatchedOrderStore, watchedOrderStoreApi } from '../../stores';

const PENDING_TOAST_DURATION_MS = secondsToMilliseconds(20);

const toToastId = (orderId: string) => `shop-order-${orderId}`;

const refreshShopData = () => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shopState() });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myBadges() });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userBadgesRoot() });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfiles() });
};

export const useWatchShopOrder = () => {
  const t = useTranslations('shop');

  const orderId = useWatchedOrderStore((state) => state.orderId);
  const { data: order, isError } = useShopOrder(orderId);

  const status = order?.status;
  const isLost = isError && !order;

  const announce = ({ id, status: orderStatus }: Pick<ShopOrder, 'id' | 'status'>) => {
    const toastId = toToastId(id);

    match(orderStatus)
      .with('pending', () => {
        toast.loading(t('paymentPending'), { id: toastId, duration: PENDING_TOAST_DURATION_MS });
      })
      .with('succeeded', () => {
        toast.success(t('paymentSucceeded'), {
          id: toastId,
          action: {
            label: t('openItems'),
            onClick: () => appEvents.emit.settingsOpen({ tab: 'appearance' })
          }
        });
        refreshShopData();
      })
      .with('canceled', () => {
        toast.error(t('paymentCanceled'), { id: toastId });
      })
      .with('refunded', () => {
        toast.info(t('paymentRefunded'), { id: toastId });
        refreshShopData();
      })
      .exhaustive();

    if (orderStatus !== 'pending' && watchedOrderStoreApi.get().orderId === id) {
      watchedOrderStoreApi.set({ orderId: null });
    }
  };

  const announceWatched = useEffectEvent((watched: Pick<ShopOrder, 'id' | 'status'>) => {
    announce(watched);
  });

  const reportLost = useEffectEvent((id: string) => {
    toast.error(t('orderCheckFailed'), { id: toToastId(id) });
    watchedOrderStoreApi.set({ orderId: null });
  });

  useRealtimeMessage((message) => {
    if (message.type === 'shop.order') {
      announce(message.order);
    }
  });

  useEffect(() => {
    if (orderId && status) {
      announceWatched({ id: orderId, status });
    }
  }, [orderId, status]);

  useEffect(() => {
    if (orderId && isLost) {
      reportLost(orderId);
    }
  }, [orderId, isLost]);
};
