import { EN_PREFIX, ROUTES } from '@/shared/constants';

import type { LocalizeMarketingPathInput } from './localize-marketing-path.types';

/** Prefixes a marketing path with `/en` for English; Russian stays at the bare path. */
export const localizeMarketingPath = ({ path, locale }: LocalizeMarketingPathInput): string => {
  if (locale !== 'en') {
    return path;
  }

  return path === ROUTES.home ? EN_PREFIX : `${EN_PREFIX}${path}`;
};
