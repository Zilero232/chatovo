import { isTauriMobile } from '../tauri-platform';

const ANDROID_EMULATOR_HOST = '10.0.2.2';

const isLocalDevHost = (hostname: string) =>
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost');

export const resolveMobileDevUrl = (url: string): string => {
  if (typeof window === 'undefined' || !isTauriMobile()) {
    return url;
  }

  try {
    const parsed = new URL(url);

    if (!isLocalDevHost(parsed.hostname)) {
      return url;
    }

    parsed.hostname = ANDROID_EMULATOR_HOST;

    return parsed.toString();
  } catch {
    return url;
  }
};
