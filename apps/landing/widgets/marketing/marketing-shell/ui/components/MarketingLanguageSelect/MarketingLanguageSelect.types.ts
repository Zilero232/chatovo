import type { SelectVariant } from '@chatovo/ui-kit';

import type { Locale } from '@/shared/i18n';

export type MarketingLanguageSelectProps = {
  locale: Locale;
  hrefs: Record<Locale, string>;
  label: string;
  variant?: SelectVariant;
  className?: string;
  onNavigate?: () => void;
};
