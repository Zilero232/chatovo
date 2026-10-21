import type { Locale } from './shared/i18n/config';
import type { en as messages } from './shared/i18n/locales/en';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages;
    Locale: Locale;
  }
}
