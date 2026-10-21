import type { Locale } from '@/shared/i18n';

import { STORAGE_KEYS } from '@/shared/constants';
import { detectLocale, resolveLocale } from '@/shared/i18n';

export const SYSTEM_LOCALE = detectLocale(navigator.languages);

export const readInitialLocale = (): Locale => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.locale);

    return stored ? resolveLocale(stored) : SYSTEM_LOCALE;
  } catch {
    return SYSTEM_LOCALE;
  }
};
