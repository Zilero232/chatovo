import { describe, expect, it } from 'vitest';

import { ApiError } from '../../http';
import { unwrapAuth } from '../unwrap-auth';

const ok = <T>(data: T) => Promise.resolve({ data, error: null });
const fail = (error: { code?: string; message?: string }) =>
  Promise.resolve({ data: null as never, error });

describe('unwrapAuth', () => {
  it('returns data when there is no error', async () => {
    await expect(unwrapAuth(ok({ id: '1' }), 'fallback')).resolves.toEqual({ id: '1' });
  });

  it('keeps a known better-auth code so the UI can localize it', async () => {
    await expect(
      unwrapAuth(fail({ code: 'USER_NOT_FOUND', message: 'User not found' }), 'fallback')
    ).rejects.toMatchObject({ code: 'USER_NOT_FOUND', message: 'User not found' });
  });

  it('maps codes absent from the schema to INTERNAL_ERROR', async () => {
    await expect(
      unwrapAuth(fail({ code: 'PROVIDER_NOT_FOUND', message: 'Provider not found' }), 'fallback')
    ).rejects.toMatchObject({ code: 'INTERNAL_ERROR' });
  });

  it('falls back to INTERNAL_ERROR when no code is present', async () => {
    await expect(unwrapAuth(fail({ message: 'boom' }), 'fallback')).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
      message: 'boom'
    });
  });

  it('uses the fallback message when the error carries none', async () => {
    await expect(unwrapAuth(fail({ code: 'INVALID_TOKEN' }), 'fallback')).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
      message: 'fallback'
    });
  });

  it('throws an ApiError, not a bare Error', async () => {
    await expect(unwrapAuth(fail({ code: 'INVALID_EMAIL' }), 'fallback')).rejects.toBeInstanceOf(
      ApiError
    );
  });
});
