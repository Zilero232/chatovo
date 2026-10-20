import type { Locale } from '@/shared/i18n';

import type { SupportGroupKey } from '../../../config';

export type SupportGroupProps = {
  groupKey: SupportGroupKey;
  locale: Locale;
};
