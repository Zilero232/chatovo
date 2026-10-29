import { secondsToMilliseconds } from 'date-fns';

export const PUSH_LOCALES = ['en', 'ru', 'uk', 'es', 'pt', 'de', 'fr', 'tr', 'pl'] as const;

export type PushLocale = (typeof PUSH_LOCALES)[number];

export const DEFAULT_PUSH_LOCALE: PushLocale = 'en';

export const CALL_PUSH_TTL_MS = secondsToMilliseconds(45);

export const CALL_PUSH_TEXT: Record<PushLocale, { incoming: string; missed: string }> = {
  en: { incoming: 'Incoming call', missed: 'Missed call' },
  ru: { incoming: 'Входящий звонок', missed: 'Пропущенный звонок' },
  uk: { incoming: 'Вхідний дзвінок', missed: 'Пропущений дзвінок' },
  es: { incoming: 'Llamada entrante', missed: 'Llamada perdida' },
  pt: { incoming: 'Chamada recebida', missed: 'Chamada perdida' },
  de: { incoming: 'Eingehender Anruf', missed: 'Verpasster Anruf' },
  fr: { incoming: 'Appel entrant', missed: 'Appel manqué' },
  tr: { incoming: 'Gelen arama', missed: 'Cevapsız arama' },
  pl: { incoming: 'Połączenie przychodzące', missed: 'Nieodebrane połączenie' }
};
