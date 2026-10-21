import type { Locale } from './config';
import type { en } from './locales/en';

export type Messages = typeof en;

const LOADERS: Record<Locale, () => Promise<Messages>> = {
  en: async () => (await import('./locales/en')).en,
  ru: async () => (await import('./locales/ru')).ru,
  uk: async () => (await import('./locales/uk')).uk,
  es: async () => (await import('./locales/es')).es,
  pt: async () => (await import('./locales/pt')).pt,
  de: async () => (await import('./locales/de')).de,
  fr: async () => (await import('./locales/fr')).fr,
  tr: async () => (await import('./locales/tr')).tr,
  pl: async () => (await import('./locales/pl')).pl
};

const loaded = new Map<Locale, Promise<Messages>>();

export const loadMessages = (locale: Locale): Promise<Messages> => {
  const cached = loaded.get(locale);

  if (cached) {
    return cached;
  }

  const pending = LOADERS[locale]().catch((error: unknown) => {
    loaded.delete(locale);

    throw error;
  });

  loaded.set(locale, pending);

  return pending;
};
