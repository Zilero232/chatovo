import { getTranslations } from 'next-intl/server';

import { ROUTES } from '@/shared/constants';
import { localizeMarketingPath } from '@/shared/lib';
import { MarketingCtaPanel } from '@/widgets/marketing/marketing-shell';

import type { FeaturesCtaProps } from './FeaturesCta.types';

export const FeaturesCta = async ({ locale }: FeaturesCtaProps) => {
  const t = await getTranslations({ locale, namespace: 'features.cta' });

  return (
    <MarketingCtaPanel
      secondary={{
        label: t('download'),
        href: localizeMarketingPath({ path: ROUTES.download, locale })
      }}
      actionLabel={t('signIn')}
      chato='listen'
      description={t('description')}
      heading={t('heading')}
    />
  );
};
