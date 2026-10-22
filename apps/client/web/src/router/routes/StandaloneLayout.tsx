import { Outlet } from '@tanstack/react-router';

import { StandaloneShell } from '@/widgets/layout/standalone-shell';

import { AppProviders } from '../../providers';

export const StandaloneLayout = () => (
  <AppProviders>
    <StandaloneShell>
      <Outlet />
    </StandaloneShell>
  </AppProviders>
);
