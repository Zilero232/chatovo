import type { CosmeticKey, ShopProductKey } from '@chatovo/schemas';

import type { ShopCatalog } from '../../../lib/build-shop-catalog';

export type ShopGridProps = {
  catalog: ShopCatalog;
  tryOn: ShopProductKey | null;
  busyKey: ShopProductKey | null;
  canPurchase: boolean;
  showPrice: boolean;
  isEquipping: boolean;
  onBuy: (key: ShopProductKey) => void;
  onToggleEquip: (key: CosmeticKey) => void;
  onTryOn: (key: ShopProductKey) => void;
};
