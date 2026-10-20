import { getTranslations } from 'next-intl/server';

import type { MarketingContributorsProps } from './MarketingContributors.types';

import { MarketingContributorsList } from '../MarketingContributorsList/MarketingContributorsList';

export const MarketingContributors = async ({ locale }: MarketingContributorsProps) => {
  const t = await getTranslations({ locale, namespace: 'about.contributors' });

  return <MarketingContributorsList description={t('subheading')} heading={t('heading')} />;
};
