import type { Locale } from '@/shared/i18n';

import type { ChangelogEntry } from '../../../config';

export type ChangelogEntryRowProps = {
  entry: ChangelogEntry;
  locale: Locale;
};
