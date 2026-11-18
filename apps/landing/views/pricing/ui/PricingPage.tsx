import { getTranslations } from 'next-intl/server';

import { ROUTES } from '@/shared/constants';
import {
  MarketingHero,
  MarketingSection,
  MarketingShell
} from '@/widgets/marketing/marketing-shell';

import type { PricingPageProps } from './PricingPage.types';

import { PricingPayment, PricingSets, PricingSteps, PricingTable } from './components';

export const PricingPage = async ({ locale }: PricingPageProps) => {
  const t = await getTranslations({ locale, namespace: 'pricing' });

  return (
    <MarketingShell locale={locale} path={ROUTES.pricing}>
      <MarketingHero
        chato='wave'
        description={t('hero.description')}
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
      />

      <MarketingSection>
        <PricingSets locale={locale} />
      </MarketingSection>

      <MarketingSection>
        <PricingTable locale={locale} />
      </MarketingSection>

      <MarketingSection>
        <PricingSteps locale={locale} />
      </MarketingSection>

      <MarketingSection>
        <PricingPayment locale={locale} />
      </MarketingSection>
    </MarketingShell>
  );
};
