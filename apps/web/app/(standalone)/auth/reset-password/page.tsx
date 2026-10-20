import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { ResetPasswordPage } from '@/views/reset-password';

export const metadata = createPageMetadata({
  title: 'Reset password',
  description: 'Choose a new password for your Chatovo account.',
  path: ROUTES.resetPassword,
  index: false,
  follow: false
});

const Page = () => <ResetPasswordPage />;

export default Page;
