import type { ApiErrorCode } from '@chatovo/schemas';

import { apiErrorSchema } from '@chatovo/schemas';

import { HTTP_STATUS } from '@/shared/constants';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;

  constructor(code: ApiErrorCode, message: string, status: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

/** Returns `null` when the payload is not a server error envelope, so the caller can rethrow as-is. */
export const toApiError = (data: unknown, status: number | null = null) => {
  const parsed = apiErrorSchema.safeParse(data);

  if (!parsed.success) {
    return null;
  }

  return new ApiError(parsed.data.code, parsed.data.error, status);
};

export const apiErrorCode = (error: unknown): ApiErrorCode =>
  error instanceof ApiError ? error.code : 'INTERNAL_ERROR';

/** True for a rejected session: the token is gone, expired or no longer accepted by the server. */
export const isUnauthorizedError = (error: unknown) =>
  error instanceof ApiError &&
  (error.status === HTTP_STATUS.unauthorized || error.code === 'UNAUTHORIZED');
