'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES, STORAGE_KEYS } from '@/shared/constants';
import { localizeMarketingPath } from '@/shared/lib';

import type { HomeLocaleRedirectProps } from './HomeLocaleRedirect.types';

const prefersRussian = () =>
  navigator.languages.some((language) => language.toLowerCase().startsWith('ru'));

export const HomeLocaleRedirect = ({ locale }: HomeLocaleRedirectProps) => {
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEYS.homeLocaleRedirected)) {
      return;
    }

    sessionStorage.setItem(STORAGE_KEYS.homeLocaleRedirected, '1');

    const target = localizeMarketingPath({
      path: ROUTES.home,
      locale: prefersRussian() ? 'ru' : 'en'
    });
    const current = localizeMarketingPath({ path: ROUTES.home, locale });

    if (target !== current) {
      router.replace(target);
    }
  }, [locale, router]);

  return null;
};
