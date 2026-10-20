'use client';

import type { ReactNode } from 'react';

import { AppSplash } from '@chatovo/ui-kit';
import { NextIntlClientProvider } from 'next-intl';
import { useEffect } from 'react';

import { DocumentTitleSync, useLocale } from '@/entities/app/locale';
import { DEFAULT_LOCALE, messages } from '@/shared/i18n';

const timeZone =
  typeof Intl !== 'undefined' ? new Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { locale, isReady } = useLocale();
  const activeLocale = isReady ? locale : DEFAULT_LOCALE;

  useEffect(() => {
    if (isReady) {
      document.documentElement.lang = locale;
    }
  }, [locale, isReady]);

  return (
    <NextIntlClientProvider
      locale={activeLocale}
      messages={messages[activeLocale]}
      timeZone={timeZone}
    >
      <DocumentTitleSync />
      {!isReady ? <AppSplash /> : children}
    </NextIntlClientProvider>
  );
};
