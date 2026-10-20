import type { ReactNode } from 'react';

import type { Locale } from '@/shared/i18n';

export type MarketingShellProps = {
  children: ReactNode;
  locale: Locale;
  path: string;
};
