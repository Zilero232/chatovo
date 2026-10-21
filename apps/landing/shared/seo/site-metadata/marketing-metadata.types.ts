import type { Locale } from '@/shared/i18n';

export type MarketingMetaNamespace =
  | 'about.meta'
  | 'changelog.meta'
  | 'download.meta'
  | 'features.meta'
  | 'home.meta'
  | 'legal.privacyMeta'
  | 'legal.termsMeta'
  | 'support.meta';

export type MarketingMetadataInput = {
  locale: Locale;
  namespace: MarketingMetaNamespace;
  path: string;
};
