import { Outlet } from '@tanstack/react-router';

import { AuthedShell } from '@/widgets/layout/authed-shell';

import { AppProviders, AuthedProviders } from '../providers/index';

export const AuthedLayout = () => (
  <AppProviders>
    <AuthedProviders>
      <AuthedShell>
        <Outlet />
      </AuthedShell>
    </AuthedProviders>
  </AppProviders>
);
