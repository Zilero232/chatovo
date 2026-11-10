import type { ApiCallFn } from 'grammy';

import { GrammyError, HttpError } from 'grammy';
import { describe, expect, it, vi } from 'vitest';

import { retryNetworkErrors } from '../retry-network-errors';

vi.mock('../../../config', () => ({ BOT_API_RETRY_DELAY_MS: 1, BOT_API_RETRY_LIMIT: 2 }));

const OK = { ok: true as const, result: true };

const networkError = () => new HttpError('Network request failed!', new Error('ECONNRESET'));

const refusal = () =>
  new GrammyError(
    'Forbidden: bot was blocked by the user',
    { ok: false, error_code: 403, description: 'Forbidden: bot was blocked by the user' },
    'sendMessage',
    {}
  );

describe('retryNetworkErrors', () => {
  it('retries a call that never got an answer', async () => {
    const prev = vi.fn().mockRejectedValueOnce(networkError()).mockResolvedValueOnce(OK);

    await expect(
      retryNetworkErrors(prev as unknown as ApiCallFn, 'sendMessage', { chat_id: 1, text: 'hi' })
    ).resolves.toEqual(OK);
    expect(prev).toHaveBeenCalledTimes(2);
  });

  it('gives up after the retry limit', async () => {
    const prev = vi.fn().mockRejectedValue(networkError());

    await expect(
      retryNetworkErrors(prev as unknown as ApiCallFn, 'sendMessage', { chat_id: 1, text: 'hi' })
    ).rejects.toBeInstanceOf(HttpError);
    expect(prev).toHaveBeenCalledTimes(3);
  });

  it('never retries an answer from Telegram', async () => {
    const error = refusal();
    const prev = vi.fn().mockRejectedValue(error);

    await expect(
      retryNetworkErrors(prev as unknown as ApiCallFn, 'sendMessage', { chat_id: 1, text: 'hi' })
    ).rejects.toBe(error);
    expect(prev).toHaveBeenCalledTimes(1);
  });
});
