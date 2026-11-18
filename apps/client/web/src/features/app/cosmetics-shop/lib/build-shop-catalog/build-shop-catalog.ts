import {
  COLLECTION_IDS,
  COLLECTIONS,
  COSMETIC_KEYS,
  COSMETICS,
  getBundlePrice,
  getCollectionItems,
  getCollectionTotal
} from '@chatovo/schemas';

import type {
  BuildShopCatalogInput,
  ShopBundleEntry,
  ShopCatalog,
  ShopItemEntry
} from './build-shop-catalog.types';

export const buildShopCatalog = ({ state, category }: BuildShopCatalogInput): ShopCatalog => {
  const owned = new Set(state.owned);

  const toEntry = (key: ShopItemEntry['key']): ShopItemEntry => {
    const item = COSMETICS[key];

    return { key, item, owned: owned.has(key), equipped: state.equipped[item.kind] === key };
  };

  if (category === 'bundles') {
    const bundles = COLLECTION_IDS.map((collection): ShopBundleEntry => {
      const items = getCollectionItems(collection);
      const { rarity, isNew } = COLLECTIONS[collection];

      return {
        key: `bundle-${collection}`,
        collection,
        rarity,
        isNew,
        items,
        priceRub: getBundlePrice(collection),
        fullPriceRub: getCollectionTotal(collection)
      };
    });

    return {
      items: [],
      bundles: bundles.filter((bundle) => bundle.items.every((key) => !owned.has(key)))
    };
  }

  const keys =
    category === 'owned'
      ? COSMETIC_KEYS.filter((key) => owned.has(key))
      : COSMETIC_KEYS.filter((key) => COSMETICS[key].kind === category);

  return { items: keys.map(toEntry), bundles: [] };
};
