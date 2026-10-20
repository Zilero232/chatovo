import type { Locale } from '@/shared/i18n';

import type { FeaturesGroupKey } from '../../../config';

export type FeaturesGroupProps = {
  groupKey: FeaturesGroupKey;
  locale: Locale;
};
