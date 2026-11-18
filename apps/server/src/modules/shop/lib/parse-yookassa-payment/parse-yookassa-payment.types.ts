import type { ShopOrderStatus } from '@chatovo/schemas';

export type YookassaPayment = {
  id: string;
  status: ShopOrderStatus;
  amountValue: string;
  currency: string;
  confirmationUrl: string | null;
  orderId: string | null;
};
