import type { en as messages } from './shared/i18n/locales/en';

declare module 'use-intl' {
  interface AppConfig {
    Messages: typeof messages;
  }
}
