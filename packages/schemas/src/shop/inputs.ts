import { z } from 'zod';

import { cosmeticKeySchema, cosmeticKindSchema, COSMETICS, shopProductKeySchema } from './catalog';

export const SHOP_ORDER_QUERY_PARAM = 'order';

export const createShopOrderInputSchema = z.object({
  productKey: shopProductKeySchema
});

export const shopOrderIdParamSchema = z.object({
  id: z.uuid()
});

export const equipCosmeticInputSchema = z
  .object({
    kind: cosmeticKindSchema,
    productKey: cosmeticKeySchema.nullable()
  })
  .refine(({ kind, productKey }) => productKey === null || COSMETICS[productKey].kind === kind, {
    path: ['productKey']
  });

export const yookassaNotificationSchema = z.object({
  type: z.literal('notification'),
  event: z.string(),
  object: z.object({
    id: z.string().min(1)
  })
});
