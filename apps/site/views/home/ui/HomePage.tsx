import { ROUTES } from '@/shared/constants';
import { MarketingShell } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from './HomePage.types';

import {
  HomeDesktop,
  HomeFaq,
  HomeFeatures,
  HomeFinalCta,
  HomeHero,
  HomeSteps
} from './components';
import { HomeLocaleRedirect } from './controllers';

export const HomePage = ({ locale }: HomePageProps) => (
  <MarketingShell locale={locale} path={ROUTES.home}>
    <HomeLocaleRedirect locale={locale} />

    <HomeHero locale={locale} />
    <HomeFeatures locale={locale} />
    <HomeSteps locale={locale} />
    <HomeDesktop locale={locale} />
    <HomeFaq locale={locale} />
    <HomeFinalCta locale={locale} />
  </MarketingShell>
);
