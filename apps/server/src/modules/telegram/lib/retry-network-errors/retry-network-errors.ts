import type { Transformer } from 'grammy';

import { HttpError } from 'grammy';
import pRetry from 'p-retry';

import { BOT_API_RETRY_DELAY_MS, BOT_API_RETRY_LIMIT } from '../../config';

export const retryNetworkErrors: Transformer = (prev, method, payload, signal) =>
  pRetry(() => prev(method, payload, signal), {
    retries: BOT_API_RETRY_LIMIT,
    minTimeout: BOT_API_RETRY_DELAY_MS,
    shouldRetry: ({ error }) => error instanceof HttpError
  });
