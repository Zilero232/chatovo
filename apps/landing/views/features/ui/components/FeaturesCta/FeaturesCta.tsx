import { localizeSitePath } from '@chatovo/config';
import { getTranslations } from 'next-intl/server';

import { ROUTES } from '@/shared/constants';
import { MarketingCtaPanel } from '@/widgets/marketing/marketing-shell';

import type { FeaturesCtaProps } from './FeaturesCta.types';

export const FeaturesCta = async ({ locale }: FeaturesCtaProps) => {
  const t = await getTranslations({ locale, namespace: 'features.cta' });

  return (
    <MarketingCtaPanel
      secondary={{
        label: t('download'),
        href: localizeSitePath({ path: ROUTES.download, locale })
      }}
      actionLabel={t('signIn')}
      chato='listen'
      description={t('description')}
      heading={t('heading')}
    />
  );
};
