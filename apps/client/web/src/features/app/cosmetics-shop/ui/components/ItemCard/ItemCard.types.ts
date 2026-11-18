import type { CosmeticKey, ShopProductKey } from '@chatovo/schemas';

import type { ShopItemEntry } from '../../../lib/build-shop-catalog';

export type ItemCardProps = {
  entry: ShopItemEntry;
  isTryingOn: boolean;
  canPurchase: boolean;
  showPrice: boolean;
  isBuying: boolean;
  isEquipping: boolean;
  onBuy: (key: ShopProductKey) => void;
  onToggleEquip: (key: CosmeticKey) => void;
  onTryOn: (key: ShopProductKey) => void;
};
