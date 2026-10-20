import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { AccountDeletePage } from '@/views/account-delete';

export const metadata = createPageMetadata({
  title: 'Delete your account',
  description: 'How to permanently delete your Chatovo account and what happens to your data.',
  path: ROUTES.accountDelete
});

const Page = () => <AccountDeletePage />;

export default Page;
