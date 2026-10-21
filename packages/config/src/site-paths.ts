import type { Locale } from './locales';

import { SITE } from './site';

export const SITE_PATHS = {
  home: '/',
  features: '/features',
  download: '/download',
  changelog: '/changelog',
  about: '/about',
  support: '/support',
  privacy: '/privacy',
  terms: '/terms'
} as const;

/** The site's default language: its pages live at the bare path, every other language under its code. */
export const SITE_DEFAULT_LOCALE: Locale = 'ru';

type LocalizeSitePathInput = {
  path: string;
  locale: Locale;
};

/** A site path in a language: `/features` → `/en/features`, `/` → `/de`; Russian stays bare. */
export const localizeSitePath = ({ path, locale }: LocalizeSitePathInput): string => {
  if (locale === SITE_DEFAULT_LOCALE) {
    return path;
  }

  return path === SITE_PATHS.home ? `/${locale}` : `/${locale}${path}`;
};

/** The absolute URL of a site page in a language, for links from the web app. */
export const siteUrl = (input: LocalizeSitePathInput): string =>
  new URL(localizeSitePath(input), SITE.url).toString();
