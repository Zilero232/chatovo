import type { Locale } from '@/shared/i18n';

import type { HomeSpotlight as HomeSpotlightConfig } from '../../../config';

export type HomeSpotlightProps = {
  locale: Locale;
  spotlight: HomeSpotlightConfig;
  isReversed: boolean;
};
