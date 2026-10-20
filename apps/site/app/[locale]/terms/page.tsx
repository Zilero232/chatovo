import type { LocalePageProps } from '@/shared/lib';

import { ROUTES } from '@/shared/constants';
import { readPageLocale } from '@/shared/lib';
import { createPageMetadata } from '@/shared/seo';
import { LegalDocumentPage } from '@/views/legal';

export const metadata = createPageMetadata({
  title: 'Terms of Service',
  description: 'Chatovo terms of service and community rules.',
  path: ROUTES.terms
});

const Page = async ({ params }: LocalePageProps) => (
  <LegalDocumentPage documentId='termsPage' locale={await readPageLocale(params)} />
);

export default Page;
