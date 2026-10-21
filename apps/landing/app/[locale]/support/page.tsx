import type { Metadata } from 'next';

import type { LocalePageProps } from '@/shared/lib';

import { ROUTES } from '@/shared/constants';
import { readPageLocale } from '@/shared/lib';
import { createMarketingMetadata } from '@/shared/seo';
import { SupportPage } from '@/views/support';

export const generateMetadata = async ({ params }: LocalePageProps): Promise<Metadata> =>
  createMarketingMetadata({
    locale: await readPageLocale(params),
    namespace: 'support.meta',
    path: ROUTES.support
  });

const Page = async ({ params }: LocalePageProps) => (
  <SupportPage locale={await readPageLocale(params)} />
);

export default Page;
