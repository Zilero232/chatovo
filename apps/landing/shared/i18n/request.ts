import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE, isLocale } from './config';
import { messages } from './messages';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  return {
    locale,
    messages: messages[locale],
    timeZone: 'UTC'
  };
});
