import type { MarketingNavItem } from '../MarketingHeaderNav/MarketingHeaderNav.types';

export type MarketingAuthLabels = {
  signIn: string;
  openApp: string;
};

export type MarketingHeaderMobileNavProps = {
  authLabels: MarketingAuthLabels;
  items: MarketingNavItem[];
  localeSwitchHref: string;
  localeSwitchHrefLang: string;
  localeSwitchLabel: string;
  menuDescription: string;
  menuLabel: string;
  menuTitle: string;
};
