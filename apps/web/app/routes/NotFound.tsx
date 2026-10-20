import { NotFoundPage } from '@/views/not-found';

import { AppProviders } from './providers/index';

const NotFound = () => (
  <AppProviders>
    <NotFoundPage />
  </AppProviders>
);

export default NotFound;
