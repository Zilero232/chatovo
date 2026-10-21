import type { Metadata } from 'next';

import type { LocalePageProps } from '@/shared/lib';

import { ROUTES } from '@/shared/constants';
import { readPageLocale } from '@/shared/lib';
import { createMarketingMetadata } from '@/shared/seo';
import { DownloadPage } from '@/views/download';

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({ params }: LocalePageProps): Promise<Metadata> =>
  createMarketingMetadata({
    locale: await readPageLocale(params),
    namespace: 'download.meta',
    path: ROUTES.download
  });

const Page = async ({ params }: LocalePageProps) => (
  <DownloadPage locale={await readPageLocale(params)} />
);

export default Page;
