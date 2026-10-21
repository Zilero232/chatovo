import { SITE_PATHS, siteUrl } from '@/shared/config';

import { useLocale } from './use-locale';

export const useLegalLinks = () => {
  const { locale } = useLocale();

  return {
    privacy: siteUrl({ path: SITE_PATHS.privacy, locale }),
    terms: siteUrl({ path: SITE_PATHS.terms, locale })
  };
};
