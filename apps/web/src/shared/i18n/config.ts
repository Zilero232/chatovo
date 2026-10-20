export const LOCALES = ['en', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const resolveLocale = (value: string | undefined): Locale =>
  LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
