import { describe, expect, it } from 'vitest';

import { parseYookassaRefund } from '../parse-yookassa-refund';

describe('parseYookassaRefund', () => {
  it('maps a succeeded refund to its payment', () => {
    expect(
      parseYookassaRefund({ id: 'r-1', payment_id: 'p-1', status: 'succeeded', amount: {} })
    ).toEqual({ id: 'r-1', paymentId: 'p-1', succeeded: true });
  });

  it('treats a pending or canceled refund as not succeeded', () => {
    expect(parseYookassaRefund({ id: 'r-1', payment_id: 'p-1', status: 'pending' }).succeeded).toBe(
      false
    );
    expect(
      parseYookassaRefund({ id: 'r-1', payment_id: 'p-1', status: 'canceled' }).succeeded
    ).toBe(false);
  });

  it('throws on a payload without the payment id', () => {
    expect(() => parseYookassaRefund({ id: 'r-1', status: 'succeeded' })).toThrow();
  });
});
