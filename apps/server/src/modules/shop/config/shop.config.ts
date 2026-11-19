import { hoursToMilliseconds, minutesToMilliseconds, secondsToMilliseconds } from 'date-fns';

export const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3';

export const YOOKASSA_TIMEOUT_MS = secondsToMilliseconds(10);

export const YOOKASSA_CURRENCY = 'RUB';

export const PAYMENT_DESCRIPTION_PREFIX = 'Chatovo';

export const YOOKASSA_WEBHOOK_CIDRS = [
  '185.71.76.0/27',
  '185.71.77.0/27',
  '77.75.153.0/25',
  '77.75.156.11/32',
  '77.75.156.35/32',
  '77.75.154.128/25',
  '2a02:5180::/32'
] as const;

export const LOOPBACK_CIDRS = ['127.0.0.1/32', '::1/128'] as const;

export const PENDING_ORDER_SWEEP = {
  intervalMs: minutesToMilliseconds(5),
  minAgeMs: minutesToMilliseconds(2),
  maxAgeMs: hoursToMilliseconds(24),
  batchSize: 50
} as const;

export const REFUND_EVENT_PREFIX = 'refund.';
