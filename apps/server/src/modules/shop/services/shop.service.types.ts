import type { CosmeticKey, EquipCosmeticInput, ShopProductKey } from '@chatovo/schemas';

export type CreatePaymentInput = {
  orderId: string;
  productKey: ShopProductKey;
  amountRub: number;
  customerEmail: string;
};

export type YookassaRequestInput = {
  path: string;
  method: 'GET' | 'POST';
  idempotenceKey?: string;
  body?: unknown;
};

export type CreateShopOrderInput = {
  userId: string;
  productKey: ShopProductKey;
};

export type GetShopOrderInput = {
  userId: string;
  orderId: string;
};

export type EquipCosmeticServiceInput = {
  userId: string;
  input: EquipCosmeticInput;
};

export type AssertNotOwnedInput = {
  userId: string;
  items: CosmeticKey[];
};
