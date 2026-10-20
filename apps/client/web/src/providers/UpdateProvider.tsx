import type { ReactNode } from 'react';

import { UpdateBootstrap } from '@/features/app/check-app-update';
import { isTauriDesktop } from '@/shared/lib';

const isDev = import.meta.env.MODE === 'development';

export const UpdateProvider = ({ children }: { children: ReactNode }) => {
  if (isDev || !isTauriDesktop()) {
    return children;
  }

  return <UpdateBootstrap>{children}</UpdateBootstrap>;
};
