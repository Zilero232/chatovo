import type { ReactNode } from 'react';

import { AppProviders } from '../providers/index';

const StandaloneLayout = ({ children }: { children: ReactNode }) => (
  <AppProviders>{children}</AppProviders>
);

export default StandaloneLayout;
