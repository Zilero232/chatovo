import { z } from 'zod';

import { cosmeticKeySchema, equippedCosmeticSchema, shopProductKeySchema } from './catalog';

export const equippedCosmeticsSchema = z.object({
  speakingRing: equippedCosmeticSchema.default(null),
  avatarFrame: equippedCosmeticSchema.default(null),
  nameStyle: equippedCosmeticSchema.default(null),
  tileBackground: equippedCosmeticSchema.default(null)
});

export const shopStateSchema = z.object({
  enabled: z.boolean(),
  unlockedAll: z.boolean().default(false),
  owned: z.array(cosmeticKeySchema),
  equipped: equippedCosmeticsSchema
});

export const shopOrderStatusSchema = z.enum(['pending', 'succeeded', 'canceled', 'refunded']);

export const shopOrderSchema = z.object({
  id: z.string(),
  productKey: shopProductKeySchema,
  status: shopOrderStatusSchema,
  confirmationUrl: z.string().nullable()
});
