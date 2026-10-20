import { useLocalStorage } from '@siberiacancode/reactuse';

import type { Locale } from '@/shared/i18n';

import { STORAGE_KEYS } from '@/shared/constants';
import { DEFAULT_LOCALE, resolveLocale } from '@/shared/i18n';

type UseLocale = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocale = (): UseLocale => {
  const { value, set } = useLocalStorage<Locale>(STORAGE_KEYS.locale, DEFAULT_LOCALE);

  return { locale: resolveLocale(value), setLocale: set };
};
