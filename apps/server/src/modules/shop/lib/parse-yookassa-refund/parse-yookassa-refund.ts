import { z } from 'zod';

import type { YookassaRefund } from './parse-yookassa-refund.types';

const yookassaRefundSchema = z.object({
  id: z.string().min(1),
  payment_id: z.string().min(1),
  status: z.string()
});

export const parseYookassaRefund = (payload: unknown): YookassaRefund => {
  const { id, payment_id: paymentId, status } = yookassaRefundSchema.parse(payload);

  return { id, paymentId, succeeded: status === 'succeeded' };
};
