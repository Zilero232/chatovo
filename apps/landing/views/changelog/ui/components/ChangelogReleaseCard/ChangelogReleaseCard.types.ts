import type { Locale } from '@/shared/i18n';

import type { ChangelogRelease } from '../../../config';

export type ChangelogReleaseCardProps = {
  isLatest: boolean;
  locale: Locale;
  release: ChangelogRelease;
};
