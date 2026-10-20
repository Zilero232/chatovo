export const LOCALES = ['ru', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ru';

export const isLocale = (value: string | undefined): value is Locale =>
  LOCALES.includes(value as Locale);
