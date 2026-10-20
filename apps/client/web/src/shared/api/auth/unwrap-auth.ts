import type { ApiErrorCode } from '@chatovo/schemas';

import { apiErrorCodeSchema } from '@chatovo/schemas';

import { ApiError } from '../http';

type AuthResult<TData> = {
  data: TData;
  error?: { code?: string; message?: string } | null;
};

const toApiErrorCode = (code: string | undefined): ApiErrorCode => {
  const parsed = apiErrorCodeSchema.safeParse(code);

  return parsed.success ? parsed.data : 'INTERNAL_ERROR';
};

/**
 * Unwraps a better-auth response, throwing an `ApiError` that keeps the
 * server's error code so the UI can localize it. Codes better-auth reports
 * but `apiErrorCodeSchema` does not list fall back to `INTERNAL_ERROR`.
 */
export const unwrapAuth = async <TData>(
  request: Promise<AuthResult<TData>>,
  fallbackMessage: string
): Promise<TData> => {
  const { data, error } = await request;

  if (error) {
    throw new ApiError(toApiErrorCode(error.code), error.message ?? fallbackMessage);
  }

  return data;
};
