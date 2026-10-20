'use client';

import type { Locale as DateFnsLocale } from 'date-fns';

import { enGB, ru } from 'date-fns/locale';

import type { Locale as AppLocale } from '@/shared/i18n';

import { useLocale } from './use-locale';

const DATE_FNS_LOCALES: Record<AppLocale, DateFnsLocale> = {
  en: enGB,
  ru
};

export const useDateLocale = (): DateFnsLocale => {
  const { locale } = useLocale();

  return DATE_FNS_LOCALES[locale];
};
