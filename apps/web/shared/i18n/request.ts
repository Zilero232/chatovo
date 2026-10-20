import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE, resolveLocale } from './config';
import { messages } from './messages';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested ? resolveLocale(requested) : DEFAULT_LOCALE;

  return {
    locale,
    messages: messages[locale],
    timeZone: 'UTC'
  };
});
