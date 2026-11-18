import type { EquippedCosmetics } from '@chatovo/schemas';

export type ShopPreviewProps = {
  preview: EquippedCosmetics;
  isTryingOn: boolean;
  onReset: () => void;
};
