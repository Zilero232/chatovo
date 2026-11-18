import type { ShopCategory } from '../lib/build-shop-catalog';

export const SHOP_CATEGORIES = [
  'bundles',
  'speakingRing',
  'avatarFrame',
  'nameStyle',
  'tileBackground',
  'owned'
] as const satisfies readonly ShopCategory[];

export const RUB_FORMAT = {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
} as const;
