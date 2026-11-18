import type { ShopOrderStatus } from '@chatovo/schemas';

import { z } from 'zod';

import type { YookassaPayment } from './parse-yookassa-payment.types';

const yookassaPaymentSchema = z.object({
  id: z.string().min(1),
  status: z.string(),
  amount: z.object({
    value: z.string(),
    currency: z.string()
  }),
  confirmation: z
    .object({
      confirmation_url: z.string().optional()
    })
    .optional(),
  metadata: z.record(z.string(), z.string()).optional()
});

const toOrderStatus = (status: string): ShopOrderStatus => {
  if (status === 'succeeded') {
    return 'succeeded';
  }

  if (status === 'canceled') {
    return 'canceled';
  }

  return 'pending';
};

export const parseYookassaPayment = (payload: unknown): YookassaPayment => {
  const { id, status, amount, confirmation, metadata } = yookassaPaymentSchema.parse(payload);

  return {
    id,
    status: toOrderStatus(status),
    amountValue: amount.value,
    currency: amount.currency,
    confirmationUrl: confirmation?.confirmation_url ?? null,
    orderId: metadata?.orderId ?? null
  };
};
