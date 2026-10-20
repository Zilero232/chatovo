import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { AdminPage } from '@/views/admin';

export const metadata = createPageMetadata({
  title: 'Admin',
  description: 'Moderation, users and service stats.',
  path: ROUTES.admin,
  index: false,
  follow: false
});

const Page = () => <AdminPage />;

export default Page;
