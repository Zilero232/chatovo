import { Outlet } from '@tanstack/react-router';

import { AppProviders } from '../providers/index';

export const StandaloneLayout = () => (
  <AppProviders>
    <Outlet />
  </AppProviders>
);
