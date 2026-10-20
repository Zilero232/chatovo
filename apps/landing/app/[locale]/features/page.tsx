import type { Metadata } from 'next';

import type { LocalePageProps } from '@/shared/lib';

import { ROUTES } from '@/shared/constants';
import { readPageLocale } from '@/shared/lib';
import { createMarketingMetadata } from '@/shared/seo';
import { FeaturesPage } from '@/views/features';

export const generateMetadata = async ({ params }: LocalePageProps): Promise<Metadata> =>
  createMarketingMetadata({
    locale: await readPageLocale(params),
    namespace: 'features',
    path: ROUTES.features
  });

const Page = async ({ params }: LocalePageProps) => (
  <FeaturesPage locale={await readPageLocale(params)} />
);

export default Page;
