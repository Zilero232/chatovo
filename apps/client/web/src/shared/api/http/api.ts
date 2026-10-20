import axios from 'axios';

import { env } from '@/shared/config';
import { appEvents } from '@/shared/lib';

import { clearToken, getAuthToken } from '../auth';
import { isUnauthorizedError, toApiError } from './api-error';

export const REQUEST_TIMEOUT_MS = 20_000;
export const UPLOAD_TIMEOUT_MS = 120_000;

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: REQUEST_TIMEOUT_MS
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const rejectSession = () => {
  clearToken();
  appEvents.emit.sessionExpired();
};

api.interceptors.response.use(undefined, (error) => {
  if (!axios.isAxiosError(error)) {
    return Promise.reject(error);
  }

  const status = error.response?.status ?? null;
  const apiError = toApiError(error.response?.data, status);

  if (isUnauthorizedError(apiError)) {
    rejectSession();
  }

  if (apiError) {
    return Promise.reject(apiError);
  }

  return Promise.reject(error);
});
