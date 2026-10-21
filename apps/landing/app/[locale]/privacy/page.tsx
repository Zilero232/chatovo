import type { Metadata } from 'next';

import type { LocalePageProps } from '@/shared/lib';

import { ROUTES } from '@/shared/constants';
import { readPageLocale } from '@/shared/lib';
import { createMarketingMetadata } from '@/shared/seo';
import { LegalDocumentPage } from '@/views/legal';

export const generateMetadata = async ({ params }: LocalePageProps): Promise<Metadata> =>
  createMarketingMetadata({
    locale: await readPageLocale(params),
    namespace: 'legal.privacyMeta',
    path: ROUTES.privacy
  });

const Page = async ({ params }: LocalePageProps) => (
  <LegalDocumentPage documentId='privacyPage' locale={await readPageLocale(params)} />
);

export default Page;
