import type { EquippedCosmetics, ShopProductKey } from '@chatovo/schemas';

export type MergeTryOnInput = {
  equipped: EquippedCosmetics;
  tryOn: ShopProductKey | null;
};
