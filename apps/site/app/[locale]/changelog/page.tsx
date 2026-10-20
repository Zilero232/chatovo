import type { Metadata } from 'next';

import type { LocalePageProps } from '@/shared/lib';

import { ROUTES } from '@/shared/constants';
import { readPageLocale } from '@/shared/lib';
import { createMarketingMetadata } from '@/shared/seo';
import { ChangelogPage } from '@/views/changelog';

export const generateMetadata = async ({ params }: LocalePageProps): Promise<Metadata> =>
  createMarketingMetadata({
    locale: await readPageLocale(params),
    namespace: 'changelog',
    path: ROUTES.changelog
  });

const Page = async ({ params }: LocalePageProps) => (
  <ChangelogPage locale={await readPageLocale(params)} />
);

export default Page;
