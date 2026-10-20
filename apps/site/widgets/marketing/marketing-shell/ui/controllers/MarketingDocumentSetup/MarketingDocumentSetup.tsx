'use client';

import { useEffect } from 'react';

import { SITE } from '@/shared/config';

import type { MarketingDocumentSetupProps } from './MarketingDocumentSetup.types';

const MARKETING_CLASS = 'marketing';

const HTML_LANG = {
  ru: SITE.lang,
  en: SITE.en.lang
};

export const MarketingDocumentSetup = ({ locale }: MarketingDocumentSetupProps) => {
  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;

    root.classList.add(MARKETING_CLASS);
    root.lang = HTML_LANG[locale];

    return () => {
      root.classList.remove(MARKETING_CLASS);
      root.lang = previousLang;
    };
  }, [locale]);

  return null;
};
