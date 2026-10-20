import { describe, expect, it } from 'vitest';

import { ApiError, apiErrorCode, isUnauthorizedError, toApiError } from '../api-error';

describe('toApiError', () => {
  it('parses a server error envelope into a typed error', () => {
    const error = toApiError({ error: 'Room not found', code: 'ROOM_NOT_FOUND' }, 404);

    expect(error).toBeInstanceOf(ApiError);
    expect(error?.code).toBe('ROOM_NOT_FOUND');
    expect(error?.message).toBe('Room not found');
    expect(error?.status).toBe(404);
  });

  it('returns null for a payload that is not an error envelope, so the caller can rethrow', () => {
    expect(toApiError({ rooms: [] })).toBeNull();
    expect(toApiError(undefined)).toBeNull();
    expect(toApiError('boom')).toBeNull();
  });

  it('leaves the status null when the response carried none', () => {
    expect(toApiError({ error: 'nope', code: 'INTERNAL_ERROR' })?.status).toBeNull();
  });
});

describe('apiErrorCode', () => {
  it('falls back to INTERNAL_ERROR for anything that is not an ApiError', () => {
    expect(apiErrorCode(new Error('boom'))).toBe('INTERNAL_ERROR');
    expect(apiErrorCode(null)).toBe('INTERNAL_ERROR');
  });

  it('reads the code off an ApiError', () => {
    expect(apiErrorCode(new ApiError('FORBIDDEN', 'nope'))).toBe('FORBIDDEN');
  });
});

describe('isUnauthorizedError', () => {
  it('recognises a 401 whatever code the server attached', () => {
    expect(isUnauthorizedError(new ApiError('INTERNAL_ERROR', 'nope', 401))).toBe(true);
  });

  it('recognises the UNAUTHORIZED code even when the status is missing', () => {
    expect(isUnauthorizedError(new ApiError('UNAUTHORIZED', 'nope'))).toBe(true);
  });

  it('does not treat other failures as a rejected session', () => {
    expect(isUnauthorizedError(new ApiError('ROOM_NOT_FOUND', 'nope', 404))).toBe(false);
    expect(isUnauthorizedError(new Error('network'))).toBe(false);
    expect(isUnauthorizedError(null)).toBe(false);
  });
});
