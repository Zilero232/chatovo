import type { ReactNode } from 'react';

import { useEffect } from 'react';
import { IntlProvider } from 'use-intl';

import { DocumentTitleSync, useLocale } from '@/entities/app/locale';
import { messages } from '@/shared/i18n';

const { timeZone } = new Intl.DateTimeFormat().resolvedOptions();

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { locale } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages[locale]} timeZone={timeZone}>
      <DocumentTitleSync />
      {children}
    </IntlProvider>
  );
};
