import type { ChatoPose } from '@chatovo/ui-kit';

export type MarketingCtaPanelLink = {
  label: string;
  href: string;
};

export type MarketingCtaPanelProps = {
  heading: string;
  description: string;
  actionLabel: string;
  note?: string;
  secondary?: MarketingCtaPanelLink;
  chato?: ChatoPose;
};
