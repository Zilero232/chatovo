import type { CosmeticKey, ShopProductKey } from '@chatovo/schemas';

import { COSMETICS } from '@chatovo/schemas';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useCreateShopOrder, useEquipCosmetic, useShopState } from '@/entities/app/shop';
import { isTauriDesktop, isTauriMobile, openExternal } from '@/shared/lib';

import type { ShopCategory } from '../../lib/build-shop-catalog';

import { buildShopCatalog } from '../../lib/build-shop-catalog';
import { mergeTryOn } from '../../lib/merge-try-on';
import { watchedOrderStoreApi } from '../stores';

const TOAST_ID = 'shop-order';

export const useCosmeticsShop = () => {
  const t = useTranslations('shop');
  const toastError = useToastError();

  const isWatching = watchedOrderStoreApi.use((state) => state.orderId !== null);

  const { data: state, isPending, isError, refetch } = useShopState();
  const createOrder = useCreateShopOrder();
  const equip = useEquipCosmetic();

  const isMobileApp = isTauriMobile();

  const [category, setCategory] = useState<ShopCategory>(isMobileApp ? 'owned' : 'bundles');
  const [tryOn, setTryOn] = useState<ShopProductKey | null>(null);

  const isUnlockedAll = Boolean(state?.unlockedAll);
  const activeCategory = isUnlockedAll && category === 'bundles' ? 'speakingRing' : category;
  const canPurchase = Boolean(state?.enabled) && !isMobileApp && !isWatching;
  const catalog = state
    ? buildShopCatalog({ state, category: activeCategory })
    : { items: [], bundles: [] };
  const preview = state ? mergeTryOn({ equipped: state.equipped, tryOn }) : null;

  const buy = (key: ShopProductKey) => {
    createOrder.mutate(key, {
      onSuccess: ({ id, confirmationUrl }) => {
        if (!confirmationUrl) {
          toast.error(t('paymentUnavailable'), { id: TOAST_ID });

          return;
        }

        if (isTauriDesktop()) {
          watchedOrderStoreApi.set({ orderId: id });
          toast.info(t('paymentOpened'), { id: TOAST_ID });
          openExternal(confirmationUrl);

          return;
        }

        window.location.assign(confirmationUrl);
      },
      onError: toastError(TOAST_ID)
    });
  };

  const toggleEquip = (key: CosmeticKey) => {
    const { kind } = COSMETICS[key];
    const isEquipped = state?.equipped[kind] === key;

    setTryOn(null);
    equip.mutate(
      { kind, productKey: isEquipped ? null : key },
      { onError: toastError('shop-equip') }
    );
  };

  const toggleTryOn = (key: ShopProductKey) => {
    setTryOn((current) => (current === key ? null : key));
  };

  return {
    catalog,
    preview,
    category: activeCategory,
    tryOn,
    isPending,
    isError,
    isEnabled: Boolean(state?.enabled),
    isMobileApp,
    isUnlockedAll,
    canPurchase,
    isWatching,
    busyKey: createOrder.isPending ? createOrder.variables : null,
    isEquipping: equip.isPending,
    selectCategory: setCategory,
    retry: () => refetch(),
    buy,
    toggleEquip,
    toggleTryOn,
    resetTryOn: () => setTryOn(null)
  };
};
