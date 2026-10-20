import type { Locale } from '@/shared/i18n';

import { ROUTES } from '@/shared/constants';
import { localizeMarketingPath } from '@/shared/lib';

export const MARKETING_PAGE_KEYS = [
  'features',
  'download',
  'changelog',
  'about',
  'support'
] as const;

export type MarketingPageKey = (typeof MARKETING_PAGE_KEYS)[number];

const MARKETING_PAGE_PATHS: Record<MarketingPageKey, string> = {
  features: ROUTES.features,
  download: ROUTES.download,
  changelog: ROUTES.changelog,
  about: ROUTES.about,
  support: ROUTES.support
};

export const marketingPageHref = (key: MarketingPageKey, locale: Locale) =>
  localizeMarketingPath({ path: MARKETING_PAGE_PATHS[key], locale });
