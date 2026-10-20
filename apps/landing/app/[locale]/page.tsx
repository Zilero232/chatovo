import type { Metadata } from 'next';

import type { LocalePageProps } from '@/shared/lib';

import { ROUTES } from '@/shared/constants';
import { readPageLocale } from '@/shared/lib';
import { createMarketingMetadata } from '@/shared/seo';
import { HomePage } from '@/views/home';

export const generateMetadata = async ({ params }: LocalePageProps): Promise<Metadata> =>
  createMarketingMetadata({
    locale: await readPageLocale(params),
    namespace: 'home',
    path: ROUTES.home
  });

const Page = async ({ params }: LocalePageProps) => (
  <HomePage locale={await readPageLocale(params)} />
);

export default Page;
