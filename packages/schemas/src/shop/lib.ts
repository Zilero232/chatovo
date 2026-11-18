import type {
  BundleKey,
  CollectionId,
  CosmeticItem,
  CosmeticKey,
  CosmeticKind,
  EquippedCosmetic,
  ShopProductKey
} from './types';

import { BUNDLE_DISCOUNT, COSMETIC_KEYS, COSMETICS } from './catalog';

type ResolveCosmeticInput = {
  key: EquippedCosmetic;
  kind: CosmeticKind;
};

type ShopProduct = {
  items: CosmeticKey[];
  priceRub: number;
};

/** The catalog entry for an equipped key, or null when the slot is empty or holds an item of another kind. */
export const resolveCosmetic = ({ key, kind }: ResolveCosmeticInput): CosmeticItem | null => {
  if (key === null) {
    return null;
  }

  const item = COSMETICS[key];

  return item.kind === kind ? item : null;
};

/** Whole rubles in the `"99.00"` form payment providers expect. */
export const formatRubAmount = (priceRub: number): string => priceRub.toFixed(2);

export const getCollectionItems = (collection: CollectionId): CosmeticKey[] =>
  COSMETIC_KEYS.filter((key) => COSMETICS[key].collection === collection);

/** What the items of a set cost when bought one by one. */
export const getCollectionTotal = (collection: CollectionId): number =>
  getCollectionItems(collection).reduce((sum, key) => sum + COSMETICS[key].priceRub, 0);

/** A set costs at least BUNDLE_DISCOUNT less than its parts: the discounted total, rounded down to a price ending in 9. */
export const getBundlePrice = (collection: CollectionId): number => {
  const discounted = getCollectionTotal(collection) * (1 - BUNDLE_DISCOUNT);

  return Math.floor((discounted - 9) / 10) * 10 + 9;
};

export const isBundleKey = (key: ShopProductKey): key is BundleKey => key.startsWith('bundle-');

export const toBundleCollection = (key: BundleKey): CollectionId =>
  key.slice('bundle-'.length) as CollectionId;

/** What a product grants and what it costs: one item, or every item of a set at the set price. */
export const resolveShopProduct = (key: ShopProductKey): ShopProduct => {
  if (isBundleKey(key)) {
    const collection = toBundleCollection(key);

    return { items: getCollectionItems(collection), priceRub: getBundlePrice(collection) };
  }

  return { items: [key], priceRub: COSMETICS[key].priceRub };
};
