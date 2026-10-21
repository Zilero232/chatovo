import type { Locale as DateFnsLocale } from 'date-fns';

import { useQuery } from '@tanstack/react-query';
import { enGB } from 'date-fns/locale/en-GB';

import type { Locale as AppLocale } from '@/shared/i18n';

import { QUERY_KEYS } from '@/shared/constants';

import { useLocale } from './use-locale';

const DATE_FNS_LOADERS: Record<AppLocale, () => Promise<DateFnsLocale>> = {
  en: async () => enGB,
  ru: async () => (await import('date-fns/locale/ru')).ru,
  uk: async () => (await import('date-fns/locale/uk')).uk,
  es: async () => (await import('date-fns/locale/es')).es,
  pt: async () => (await import('date-fns/locale/pt-BR')).ptBR,
  de: async () => (await import('date-fns/locale/de')).de,
  fr: async () => (await import('date-fns/locale/fr')).fr,
  tr: async () => (await import('date-fns/locale/tr')).tr,
  pl: async () => (await import('date-fns/locale/pl')).pl
};

export const useDateLocale = (): DateFnsLocale => {
  const { locale } = useLocale();

  const { data: dateLocale } = useQuery({
    queryKey: QUERY_KEYS.dateLocale(locale),
    queryFn: DATE_FNS_LOADERS[locale],
    staleTime: Infinity,
    gcTime: Infinity
  });

  return dateLocale ?? enGB;
};
