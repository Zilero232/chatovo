import { getTranslations } from 'next-intl/server';

import { ROUTES } from '@/shared/constants';
import { MarketingHero, MarketingShell } from '@/widgets/marketing/marketing-shell';

import type { FeaturesPageProps } from './FeaturesPage.types';

import { FEATURES_GROUP_KEYS } from '../config';
import { FeaturesCta, FeaturesGroup } from './components';

export const FeaturesPage = async ({ locale }: FeaturesPageProps) => {
  const t = await getTranslations({ locale, namespace: 'features.hero' });

  return (
    <MarketingShell locale={locale} path={ROUTES.features}>
      <MarketingHero
        chato='wink'
        description={t('description')}
        eyebrow={t('eyebrow')}
        title={t('title')}
      />

      {FEATURES_GROUP_KEYS.map((groupKey) => (
        <FeaturesGroup key={groupKey} groupKey={groupKey} locale={locale} />
      ))}

      <FeaturesCta locale={locale} />
    </MarketingShell>
  );
};
