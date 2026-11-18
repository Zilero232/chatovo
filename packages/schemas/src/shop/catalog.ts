import { z } from 'zod';

export const COSMETIC_KINDS = [
  'speakingRing',
  'avatarFrame',
  'nameStyle',
  'tileBackground'
] as const;

export const cosmeticKindSchema = z.enum(COSMETIC_KINDS);

export const COSMETIC_RARITIES = ['common', 'rare', 'epic', 'legendary'] as const;

export const cosmeticRaritySchema = z.enum(COSMETIC_RARITIES);

export const COLLECTION_IDS = [
  'mint',
  'sunset',
  'ocean',
  'sakura',
  'neon',
  'aurora',
  'holo',
  'royal'
] as const;

export const collectionIdSchema = z.enum(COLLECTION_IDS);

type CollectionId = z.infer<typeof collectionIdSchema>;
type CosmeticKind = z.infer<typeof cosmeticKindSchema>;
type CosmeticRarity = z.infer<typeof cosmeticRaritySchema>;

type CollectionConfig = {
  rarity: CosmeticRarity;
  colors: readonly string[];
  animated: boolean;
  isNew: boolean;
};

/** Every themed set: its palette drives all four items, so a set always matches itself. */
export const COLLECTIONS: Record<CollectionId, CollectionConfig> = {
  mint: { rarity: 'common', colors: ['#43e97b', '#38f9d7'], animated: false, isNew: false },
  sunset: { rarity: 'common', colors: ['#f83600', '#f9d423'], animated: false, isNew: false },
  ocean: { rarity: 'rare', colors: ['#2e6bff', '#1bffff'], animated: false, isNew: false },
  sakura: {
    rarity: 'rare',
    colors: ['#ff9a9e', '#fecfef', '#a18cd1'],
    animated: false,
    isNew: false
  },
  neon: {
    rarity: 'epic',
    colors: ['#08f7fe', '#fe53bb', '#f5d300'],
    animated: true,
    isNew: false
  },
  aurora: {
    rarity: 'epic',
    colors: ['#00f5a0', '#00d9f5', '#7f00ff'],
    animated: true,
    isNew: true
  },
  holo: {
    rarity: 'legendary',
    colors: ['#ff6ec7', '#7873f5', '#4adede', '#ffe66d'],
    animated: true,
    isNew: true
  },
  royal: {
    rarity: 'legendary',
    colors: ['#8e2de2', '#f7d774', '#b8860b'],
    animated: true,
    isNew: false
  }
};

/** Rubles per kind and rarity: a ring is the entry item, a tile background the priciest. */
export const COSMETIC_PRICES: Record<CosmeticRarity, Record<CosmeticKind, number>> = {
  common: { speakingRing: 79, nameStyle: 99, avatarFrame: 129, tileBackground: 149 },
  rare: { speakingRing: 99, nameStyle: 149, avatarFrame: 179, tileBackground: 199 },
  epic: { speakingRing: 149, nameStyle: 199, avatarFrame: 249, tileBackground: 249 },
  legendary: { speakingRing: 199, nameStyle: 249, avatarFrame: 349, tileBackground: 299 }
};

export const BUNDLE_DISCOUNT = 0.3;

const KIND_SLUGS = {
  speakingRing: 'ring',
  avatarFrame: 'frame',
  nameStyle: 'name',
  tileBackground: 'tile'
} as const satisfies Record<CosmeticKind, string>;

type CosmeticKey = `${CollectionId}-${(typeof KIND_SLUGS)[CosmeticKind]}`;

export const COSMETIC_KEYS = COLLECTION_IDS.flatMap((collection) =>
  COSMETIC_KINDS.map((kind): CosmeticKey => `${collection}-${KIND_SLUGS[kind]}`)
) as [CosmeticKey, ...CosmeticKey[]];

export const cosmeticKeySchema = z.enum(COSMETIC_KEYS);

type CosmeticItem = CollectionConfig & {
  collection: CollectionId;
  kind: CosmeticKind;
  priceRub: number;
};

/** Every paid cosmetic, keyed `<collection>-<kind slug>`; names live in the `shop.collections` messages. */
export const COSMETICS = Object.fromEntries(
  COLLECTION_IDS.flatMap((collection) => {
    const config = COLLECTIONS[collection];

    return COSMETIC_KINDS.map((kind) => [
      `${collection}-${KIND_SLUGS[kind]}`,
      { ...config, collection, kind, priceRub: COSMETIC_PRICES[config.rarity][kind] }
    ]);
  })
) as Record<CosmeticKey, CosmeticItem>;

export const BUNDLE_KEYS = COLLECTION_IDS.map(
  (collection): `bundle-${CollectionId}` => `bundle-${collection}`
) as [`bundle-${CollectionId}`, ...`bundle-${CollectionId}`[]];

export const bundleKeySchema = z.enum(BUNDLE_KEYS);

export const shopProductKeySchema = z.union([cosmeticKeySchema, bundleKeySchema]);

/** A stored key the catalog no longer has degrades to null instead of failing the whole parse. */
export const equippedCosmeticSchema = cosmeticKeySchema.nullable().catch(null);
