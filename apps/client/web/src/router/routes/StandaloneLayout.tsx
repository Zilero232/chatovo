import { Outlet } from '@tanstack/react-router';

import { AppProviders } from '../../providers';

export const StandaloneLayout = () => (
  <AppProviders>
    <Outlet />
  </AppProviders>
);
