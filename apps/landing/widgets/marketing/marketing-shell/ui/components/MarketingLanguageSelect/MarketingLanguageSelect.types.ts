import type { Locale } from '@/shared/i18n';

export type MarketingLanguageSelectProps = {
  locale: Locale;
  hrefs: Record<Locale, string>;
  label: string;
  className?: string;
  onNavigate?: () => void;
};
