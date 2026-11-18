import { describe, expect, it } from 'vitest';

import { parseYookassaPayment } from '../parse-yookassa-payment';

const PAYMENT = {
  id: '2d3f-000f-5000-9000-1b2c3d4e5f60',
  status: 'pending',
  paid: false,
  amount: { value: '99.00', currency: 'RUB' },
  confirmation: { type: 'redirect', confirmation_url: 'https://yoomoney.ru/checkout/x' },
  metadata: { orderId: 'order-1' }
};

describe('parseYookassaPayment', () => {
  it('maps a fresh payment with its confirmation url and order id', () => {
    expect(parseYookassaPayment(PAYMENT)).toEqual({
      id: PAYMENT.id,
      status: 'pending',
      amountValue: '99.00',
      currency: 'RUB',
      confirmationUrl: 'https://yoomoney.ru/checkout/x',
      orderId: 'order-1'
    });
  });

  it('treats waiting_for_capture as still pending', () => {
    expect(parseYookassaPayment({ ...PAYMENT, status: 'waiting_for_capture' }).status).toBe(
      'pending'
    );
  });

  it('keeps succeeded and canceled', () => {
    expect(parseYookassaPayment({ ...PAYMENT, status: 'succeeded' }).status).toBe('succeeded');
    expect(parseYookassaPayment({ ...PAYMENT, status: 'canceled' }).status).toBe('canceled');
  });

  it('returns nulls when the payment has no confirmation or metadata', () => {
    const { confirmation: _confirmation, metadata: _metadata, ...bare } = PAYMENT;

    expect(parseYookassaPayment(bare)).toMatchObject({ confirmationUrl: null, orderId: null });
  });

  it('throws on a payload without an id', () => {
    expect(() => parseYookassaPayment({ status: 'pending' })).toThrow();
  });
});
