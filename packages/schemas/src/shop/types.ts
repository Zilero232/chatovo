import type { z } from 'zod';

import type {
  bundleKeySchema,
  collectionIdSchema,
  cosmeticKeySchema,
  cosmeticKindSchema,
  cosmeticRaritySchema,
  COSMETICS,
  equippedCosmeticSchema,
  shopProductKeySchema
} from './catalog';
import type {
  createShopOrderInputSchema,
  equipCosmeticInputSchema,
  shopOrderIdParamSchema,
  yookassaNotificationSchema
} from './inputs';
import type {
  equippedCosmeticsSchema,
  shopOrderSchema,
  shopOrderStatusSchema,
  shopStateSchema
} from './outputs';

export type CosmeticKind = z.infer<typeof cosmeticKindSchema>;
export type CosmeticRarity = z.infer<typeof cosmeticRaritySchema>;
export type CollectionId = z.infer<typeof collectionIdSchema>;
export type CosmeticKey = z.infer<typeof cosmeticKeySchema>;
export type BundleKey = z.infer<typeof bundleKeySchema>;
export type ShopProductKey = z.infer<typeof shopProductKeySchema>;
export type CosmeticItem = (typeof COSMETICS)[CosmeticKey];
export type EquippedCosmetic = z.infer<typeof equippedCosmeticSchema>;
export type EquippedCosmetics = z.infer<typeof equippedCosmeticsSchema>;

export type CreateShopOrderInput = z.infer<typeof createShopOrderInputSchema>;
export type ShopOrderIdParam = z.infer<typeof shopOrderIdParamSchema>;
export type EquipCosmeticInput = z.infer<typeof equipCosmeticInputSchema>;
export type YookassaNotification = z.infer<typeof yookassaNotificationSchema>;

export type ShopState = z.infer<typeof shopStateSchema>;
export type ShopOrder = z.infer<typeof shopOrderSchema>;
export type ShopOrderStatus = z.infer<typeof shopOrderStatusSchema>;
