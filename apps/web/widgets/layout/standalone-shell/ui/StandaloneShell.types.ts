import type { LinkProps } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export type StandaloneShellProps = {
  children: ReactNode;
  backHref?: LinkProps['to'];
  backLabel?: string;
};
