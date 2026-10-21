import type { Locale } from '@chatovo/config';

import { LOCALES, SITE_DEFAULT_LOCALE } from '@chatovo/config';

export { type Locale, LOCALE_NAMES, LOCALES, OPEN_GRAPH_LOCALES } from '@chatovo/config';

export const DEFAULT_LOCALE: Locale = SITE_DEFAULT_LOCALE;

export const isLocale = (value: string | undefined): value is Locale =>
  LOCALES.includes(value as Locale);
