import { APP_SCHEME } from '@/shared/constants';

export const parseDeepLinkToAppPath = (url: string): string | null => {
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== `${APP_SCHEME}:`) {
      return null;
    }

    const path = `/${parsed.host}${parsed.pathname === '/' ? '' : parsed.pathname}`;

    return `${path}${parsed.search}`;
  } catch {
    return null;
  }
};
