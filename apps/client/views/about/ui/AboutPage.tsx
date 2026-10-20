import { getTranslations } from 'next-intl/server';

import { ROUTES } from '@/shared/constants';
import { ContributorsSection } from '@/widgets/marketing/contributors-list';
import { MarketingHero, MarketingShell } from '@/widgets/marketing/marketing-shell';

import type { AboutPageProps } from './AboutPage.types';

import { AboutContribute, AboutStack, AboutStory } from './components';

export const AboutPage = async ({ locale }: AboutPageProps) => {
  const t = await getTranslations({ locale, namespace: 'about.hero' });

  return (
    <MarketingShell locale={locale} path={ROUTES.about}>
      <MarketingHero
        chato='listen'
        description={t('description')}
        eyebrow={t('eyebrow')}
        title={t('title')}
      />

      <AboutStory locale={locale} />
      <AboutStack locale={locale} />
      <ContributorsSection locale={locale} namespace='about.contributors' />
      <AboutContribute locale={locale} />
    </MarketingShell>
  );
};
