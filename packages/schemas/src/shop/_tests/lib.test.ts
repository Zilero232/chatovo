import { describe, expect, it } from 'vitest';

import { BUNDLE_DISCOUNT, COLLECTION_IDS, COSMETIC_KEYS, COSMETICS } from '../catalog';
import { equipCosmeticInputSchema } from '../inputs';
import {
  formatRubAmount,
  getBundlePrice,
  getCollectionItems,
  getCollectionTotal,
  resolveCosmetic,
  resolveShopProduct
} from '../lib';
import { equippedCosmeticsSchema } from '../outputs';

describe('COSMETICS', () => {
  it('has one item of every kind in every collection', () => {
    expect(COSMETIC_KEYS).toHaveLength(32);
    expect(new Set(getCollectionItems('holo').map((key) => COSMETICS[key].kind)).size).toBe(4);
  });
});

describe('resolveCosmetic', () => {
  it('returns the catalog item for a key of the requested kind', () => {
    expect(resolveCosmetic({ key: 'royal-ring', kind: 'speakingRing' })?.rarity).toBe('legendary');
  });

  it('returns null for a key of another kind', () => {
    expect(resolveCosmetic({ key: 'neon-frame', kind: 'speakingRing' })).toBeNull();
  });

  it('returns null when the slot is empty', () => {
    expect(resolveCosmetic({ key: null, kind: 'avatarFrame' })).toBeNull();
  });
});

describe('formatRubAmount', () => {
  it('formats whole rubles with two decimals', () => {
    expect(formatRubAmount(99)).toBe('99.00');
  });
});

describe('getBundlePrice', () => {
  it.each(COLLECTION_IDS)('gives %s a full BUNDLE_DISCOUNT and ends in 9', (collection) => {
    const parts = getCollectionTotal(collection);
    const price = getBundlePrice(collection);

    expect(price).toBeLessThanOrEqual(parts * (1 - BUNDLE_DISCOUNT));
    expect(price % 10).toBe(9);
  });

  it('stays within ten rubles of the discounted total', () => {
    const discounted = getCollectionTotal('neon') * (1 - BUNDLE_DISCOUNT);

    expect(discounted - getBundlePrice('neon')).toBeLessThan(10);
  });
});

describe('getCollectionTotal', () => {
  it('adds up the prices of every item in the set', () => {
    const total = getCollectionItems('mint').reduce((sum, key) => sum + COSMETICS[key].priceRub, 0);

    expect(getCollectionTotal('mint')).toBe(total);
  });
});

describe('resolveShopProduct', () => {
  it('grants every item of the set for a bundle at the set price', () => {
    expect(resolveShopProduct('bundle-ocean')).toEqual({
      items: getCollectionItems('ocean'),
      priceRub: getBundlePrice('ocean')
    });
  });

  it('grants a single item at its own price', () => {
    expect(resolveShopProduct('sunset-name')).toEqual({ items: ['sunset-name'], priceRub: 99 });
  });
});

describe('equippedCosmeticsSchema', () => {
  it('degrades a key the catalog no longer has to null', () => {
    expect(equippedCosmeticsSchema.parse({ speakingRing: 'ring-gone' }).speakingRing).toBeNull();
  });

  it('fills every missing slot with null', () => {
    expect(equippedCosmeticsSchema.parse({})).toEqual({
      speakingRing: null,
      avatarFrame: null,
      nameStyle: null,
      tileBackground: null
    });
  });
});

describe('equipCosmeticInputSchema', () => {
  it('rejects an item put into a slot of another kind', () => {
    const result = equipCosmeticInputSchema.safeParse({
      kind: 'avatarFrame',
      productKey: 'royal-ring'
    });

    expect(result.success).toBe(false);
  });

  it('accepts clearing a slot', () => {
    const result = equipCosmeticInputSchema.safeParse({ kind: 'avatarFrame', productKey: null });

    expect(result.success).toBe(true);
  });
});
