import type { LocalePageProps } from '@/shared/lib';

import { ROUTES } from '@/shared/constants';
import { readPageLocale } from '@/shared/lib';
import { createPageMetadata } from '@/shared/seo';
import { LegalDocumentPage } from '@/views/legal';

export const metadata = createPageMetadata({
  title: 'Privacy Policy',
  description: 'Chatovo privacy policy — how we collect, use, and protect your data.',
  path: ROUTES.privacy
});

const Page = async ({ params }: LocalePageProps) => (
  <LegalDocumentPage documentId='privacyPage' locale={await readPageLocale(params)} />
);

export default Page;
