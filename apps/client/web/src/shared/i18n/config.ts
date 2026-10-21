import type { Locale } from '@chatovo/config';

import { LOCALES } from '@chatovo/config';
import { match } from '@formatjs/intl-localematcher';

export { type Locale, LOCALE_NAMES, LOCALES } from '@chatovo/config';

export const DEFAULT_LOCALE: Locale = 'en';

export const resolveLocale = (value: string | undefined): Locale =>
  LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;

export const detectLocale = (preferred: readonly string[]): Locale => {
  try {
    return resolveLocale(match(preferred, LOCALES, DEFAULT_LOCALE));
  } catch {
    return DEFAULT_LOCALE;
  }
};
