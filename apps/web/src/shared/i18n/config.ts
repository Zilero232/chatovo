export const LOCALES = ['en', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const resolveLocale = (value: string | undefined): Locale =>
  LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;

/** Home locale carried by the URL: `/en` is English, everything else Russian. */
export const resolveLocaleFromPath = (pathname: string): Locale =>
  pathname.startsWith('/en') ? 'en' : 'ru';
