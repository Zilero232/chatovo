import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { env } from '@/shared/config';
import { HTTP_STATUS, STORAGE_KEYS } from '@/shared/constants';
import { appEvents } from '@/shared/lib';

const resolveAuthBaseUrl = () => {
  const apiUrl = env.NEXT_PUBLIC_API_URL;

  if (apiUrl.startsWith('http')) {
    return apiUrl;
  }

  if (typeof window === 'undefined') {
    return `http://localhost${apiUrl}`;
  }

  return `${window.location.origin}${apiUrl}`;
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(STORAGE_KEYS.authToken) ?? '';
};

export const saveAuthToken = (token: string | null | undefined) => {
  if (typeof window === 'undefined' || !token) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.authToken, token);
};

export const clearToken = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.authToken);
};

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseUrl(),
  basePath: '/auth',
  session: {
    refetchOnWindowFocus: true
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: 'string', input: false },
        verified: { type: 'boolean', input: false }
      }
    })
  ],
  fetchOptions: {
    auth: {
      type: 'Bearer',
      token: getAuthToken
    },
    onSuccess: (ctx) => {
      const token = ctx.response.headers.get('set-auth-token');

      saveAuthToken(token);
    },
    onError: (ctx) => {
      if (ctx.response.status === HTTP_STATUS.unauthorized) {
        clearToken();

        appEvents.emit.sessionExpired();
      }
    }
  }
});
