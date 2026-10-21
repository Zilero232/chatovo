'use client';

import { localizeSitePath } from '@chatovo/config';
import { match } from '@formatjs/intl-localematcher';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES, STORAGE_KEYS } from '@/shared/constants';
import { DEFAULT_LOCALE, isLocale, LOCALES } from '@/shared/i18n';

import type { HomeLocaleRedirectProps } from './HomeLocaleRedirect.types';

const FALLBACK_LOCALE = 'en';

const CRAWLER_PATTERN = /bot|crawl|spider|slurp|preview/i;

const preferredLocale = () => {
  try {
    const best = match(navigator.languages, LOCALES, FALLBACK_LOCALE);

    return isLocale(best) ? best : FALLBACK_LOCALE;
  } catch {
    return FALLBACK_LOCALE;
  }
};

export const HomeLocaleRedirect = ({ locale }: HomeLocaleRedirectProps) => {
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEYS.homeLocaleRedirected)) {
      return;
    }

    sessionStorage.setItem(STORAGE_KEYS.homeLocaleRedirected, '1');

    if (locale !== DEFAULT_LOCALE || CRAWLER_PATTERN.test(navigator.userAgent)) {
      return;
    }

    const preferred = preferredLocale();

    if (preferred !== DEFAULT_LOCALE) {
      router.replace(localizeSitePath({ path: ROUTES.home, locale: preferred }));
    }
  }, [locale, router]);

  return null;
};
