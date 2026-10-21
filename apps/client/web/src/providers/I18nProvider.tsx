import type { ReactNode } from 'react';

import { use, useDeferredValue, useEffect } from 'react';
import { IntlProvider } from 'use-intl';

import { DocumentTitleSync, useLocale } from '@/entities/app/locale';
import { loadMessages } from '@/shared/i18n';

const { timeZone } = new Intl.DateTimeFormat().resolvedOptions();

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { locale: storedLocale } = useLocale();
  const locale = useDeferredValue(storedLocale);
  const messages = use(loadMessages(locale));

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages} timeZone={timeZone}>
      <DocumentTitleSync />
      {children}
    </IntlProvider>
  );
};
