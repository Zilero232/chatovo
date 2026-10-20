import type { Locale } from '@/shared/i18n';

export type TranslatedMarketingNamespace =
  'about' | 'changelog' | 'download' | 'features' | 'support';

export type MarketingNamespace = 'home' | TranslatedMarketingNamespace;

export type MarketingMetadataInput = {
  locale: Locale;
  namespace: MarketingNamespace;
  path: string;
};
