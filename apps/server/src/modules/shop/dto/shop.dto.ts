import {
  createShopOrderInputSchema,
  equipCosmeticInputSchema,
  shopOrderIdParamSchema,
  shopOrderSchema,
  shopStateSchema,
  yookassaNotificationSchema
} from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const webhookResultSchema = z.object({ ok: z.boolean() });

export class CreateShopOrderDto extends createZodDto(createShopOrderInputSchema) {}

export class ShopOrderIdParamDto extends createZodDto(shopOrderIdParamSchema) {}

export class EquipCosmeticDto extends createZodDto(equipCosmeticInputSchema) {}

export class YookassaNotificationDto extends createZodDto(yookassaNotificationSchema) {}

export class ShopStateDto extends createZodDto(shopStateSchema) {}

export class ShopOrderDto extends createZodDto(shopOrderSchema) {}

export class WebhookResultDto extends createZodDto(webhookResultSchema) {}
