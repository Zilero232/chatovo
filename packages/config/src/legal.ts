import { SITE } from './site';

export const LEGAL = {
  supportEmail: 'zilero@chatovo.ru',
  privacyUrl: `${SITE.url}/privacy`,
  termsUrl: `${SITE.url}/terms`,
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=chatovo.app'
} as const;
