import type { Locale } from '@/shared/i18n';

import type { ChangelogSummary } from '../../../lib';

export type ChangelogStatsProps = {
  locale: Locale;
  summary: ChangelogSummary;
};
