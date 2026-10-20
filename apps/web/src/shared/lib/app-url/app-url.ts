import { isTauri } from '@tauri-apps/api/core';

import { env, SITE } from '@/shared/config';

const getPublicAppOrigin = (): string => {
  if (typeof window !== 'undefined' && !isTauri()) {
    return window.location.origin;
  }

  return env.NEXT_PUBLIC_APP_URL || SITE.appUrl;
};

/** Builds a link into the app host, so an invite opens the room rather than the public site. */
export const buildPublicAppUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${getPublicAppOrigin().replace(/\/$/, '')}${normalizedPath}`;
};
