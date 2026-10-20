import type { ReactNode } from 'react';

export type StandaloneShellProps = {
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
};
