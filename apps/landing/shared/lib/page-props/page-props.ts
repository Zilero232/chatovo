import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import type { Locale } from '@/shared/i18n';

import { isLocale } from '@/shared/i18n';

import type { LocaleParams } from './page-props.types';

/** Reads the `[locale]` segment, 404s on anything unknown and enables static rendering for it. */
export const readPageLocale = async (params: LocaleParams): Promise<Locale> => {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return locale;
};
