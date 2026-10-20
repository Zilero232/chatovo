export type MarketingNavItem = {
  href: string;
  key: string;
  label: string;
};

export type MarketingHeaderNavProps = {
  ariaLabel: string;
  items: MarketingNavItem[];
};
