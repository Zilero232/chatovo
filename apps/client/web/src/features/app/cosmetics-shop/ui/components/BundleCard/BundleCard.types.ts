import type { ShopProductKey } from '@chatovo/schemas';

import type { ShopBundleEntry } from '../../../lib/build-shop-catalog';

export type BundleCardProps = {
  bundle: ShopBundleEntry;
  isTryingOn: boolean;
  canPurchase: boolean;
  isBuying: boolean;
  onBuy: (key: ShopProductKey) => void;
  onTryOn: (key: ShopProductKey) => void;
};
