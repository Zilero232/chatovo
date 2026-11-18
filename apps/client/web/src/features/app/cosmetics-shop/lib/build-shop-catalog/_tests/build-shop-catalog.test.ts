import type { ShopState } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import { buildShopCatalog } from '../build-shop-catalog';

const EMPTY_EQUIPPED = {
  speakingRing: null,
  avatarFrame: null,
  nameStyle: null,
  tileBackground: null
};

const EMPTY_STATE: ShopState = {
  enabled: true,
  unlockedAll: false,
  owned: [],
  equipped: EMPTY_EQUIPPED
};

const OWNING_STATE: ShopState = {
  enabled: true,
  unlockedAll: false,
  owned: ['neon-ring'],
  equipped: { ...EMPTY_EQUIPPED, speakingRing: 'neon-ring' }
};

describe('buildShopCatalog', () => {
  it('lists one item per collection for a kind', () => {
    const { items, bundles } = buildShopCatalog({ state: EMPTY_STATE, category: 'avatarFrame' });

    expect(items).toHaveLength(8);
    expect(items.every(({ item }) => item.kind === 'avatarFrame')).toBe(true);
    expect(bundles).toEqual([]);
  });

  it('marks owned and equipped items', () => {
    const { items } = buildShopCatalog({ state: OWNING_STATE, category: 'speakingRing' });

    expect(items.find(({ key }) => key === 'neon-ring')).toMatchObject({
      owned: true,
      equipped: true
    });
  });

  it('lists only owned items in the owned category', () => {
    const { items } = buildShopCatalog({ state: OWNING_STATE, category: 'owned' });

    expect(items.map(({ key }) => key)).toEqual(['neon-ring']);
  });

  it('offers every set at a discount while none of its parts is owned', () => {
    const { bundles } = buildShopCatalog({ state: EMPTY_STATE, category: 'bundles' });

    expect(bundles).toHaveLength(8);
    expect(bundles.every(({ priceRub, fullPriceRub }) => priceRub < fullPriceRub)).toBe(true);
  });

  it('hides a set once one of its parts is owned', () => {
    const { bundles } = buildShopCatalog({ state: OWNING_STATE, category: 'bundles' });

    expect(bundles.map(({ collection }) => collection)).not.toContain('neon');
  });
});
