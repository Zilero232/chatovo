import type { Locale } from '@/shared/i18n';

import type { MarketingNavItem } from '../MarketingHeaderNav/MarketingHeaderNav.types';

export type MarketingHeaderMobileNavProps = {
  appLabel: string;
  items: MarketingNavItem[];
  languageHrefs: Record<Locale, string>;
  languageLabel: string;
  locale: Locale;
  menuDescription: string;
  menuLabel: string;
  menuTitle: string;
};
