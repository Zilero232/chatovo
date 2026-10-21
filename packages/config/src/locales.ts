/** The languages of the web app and the site, in the order pickers list them. */
export const LOCALES = ['en', 'ru', 'uk', 'es', 'pt', 'de', 'fr', 'tr', 'pl'] as const;

export type Locale = (typeof LOCALES)[number];

/** Every language in its own words, as a language picker shows it. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  uk: 'Українська',
  es: 'Español',
  pt: 'Português',
  de: 'Deutsch',
  fr: 'Français',
  tr: 'Türkçe',
  pl: 'Polski'
};

/** Open Graph `og:locale` per language. */
export const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  uk: 'uk_UA',
  es: 'es_ES',
  pt: 'pt_BR',
  de: 'de_DE',
  fr: 'fr_FR',
  tr: 'tr_TR',
  pl: 'pl_PL'
};
