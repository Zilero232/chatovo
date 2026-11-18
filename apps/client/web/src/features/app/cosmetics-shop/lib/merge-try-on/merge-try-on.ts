import type { EquippedCosmetics } from '@chatovo/schemas';

import { COSMETICS, resolveShopProduct } from '@chatovo/schemas';

import type { MergeTryOnInput } from './merge-try-on.types';

export const mergeTryOn = ({ equipped, tryOn }: MergeTryOnInput): EquippedCosmetics => {
  if (tryOn === null) {
    return equipped;
  }

  return resolveShopProduct(tryOn).items.reduce(
    (merged, key) => ({ ...merged, [COSMETICS[key].kind]: key }),
    equipped
  );
};
