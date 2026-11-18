import type { Metadata } from 'next';

import type { LocalePageProps } from '@/shared/lib';

import { ROUTES } from '@/shared/constants';
import { readPageLocale } from '@/shared/lib';
import { createMarketingMetadata } from '@/shared/seo';
import { PricingPage } from '@/views/pricing';

export const generateMetadata = async ({ params }: LocalePageProps): Promise<Metadata> =>
  createMarketingMetadata({
    locale: await readPageLocale(params),
    namespace: 'pricing.meta',
    path: ROUTES.pricing
  });

const Page = async ({ params }: LocalePageProps) => (
  <PricingPage locale={await readPageLocale(params)} />
);

export default Page;
