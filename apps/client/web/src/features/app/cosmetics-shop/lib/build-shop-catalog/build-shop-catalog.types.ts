import type {
  BundleKey,
  CollectionId,
  CosmeticItem,
  CosmeticKey,
  CosmeticKind,
  CosmeticRarity,
  ShopState
} from '@chatovo/schemas';

export type ShopCategory = 'bundles' | 'owned' | CosmeticKind;

export type BuildShopCatalogInput = {
  state: ShopState;
  category: ShopCategory;
};

export type ShopItemEntry = {
  key: CosmeticKey;
  item: CosmeticItem;
  owned: boolean;
  equipped: boolean;
};

export type ShopBundleEntry = {
  key: BundleKey;
  collection: CollectionId;
  rarity: CosmeticRarity;
  isNew: boolean;
  items: CosmeticKey[];
  priceRub: number;
  fullPriceRub: number;
};

export type ShopCatalog = {
  items: ShopItemEntry[];
  bundles: ShopBundleEntry[];
};
