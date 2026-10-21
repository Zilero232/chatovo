import { useLocalStorage } from '@siberiacancode/reactuse';
import { startTransition } from 'react';

import type { Locale } from '@/shared/i18n';

import { STORAGE_KEYS } from '@/shared/constants';
import { loadMessages, resolveLocale } from '@/shared/i18n';

import { SYSTEM_LOCALE } from '../../lib';

type UseLocale = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocale = (): UseLocale => {
  const { value, set } = useLocalStorage<Locale>(STORAGE_KEYS.locale, SYSTEM_LOCALE);

  const setLocale = (locale: Locale) => {
    loadMessages(locale).then(
      () => startTransition(() => set(locale)),
      (error: unknown) => console.error('Failed to load the language', error)
    );
  };

  return { locale: resolveLocale(value), setLocale };
};
