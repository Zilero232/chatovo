import { env } from '@/shared/config';

import { getAuthToken } from '../auth';

export const buildRealtimeUrl = (): string => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const apiUrl = env.NEXT_PUBLIC_API_URL;
  const absolute = apiUrl.startsWith('http') ? apiUrl : `${window.location.origin}${apiUrl}`;
  const base = absolute.replace(/^http/, 'ws').replace(/\/$/, '');

  return `${base}/realtime?token=${encodeURIComponent(token)}`;
};
