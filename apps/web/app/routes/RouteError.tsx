import type { ErrorComponentProps } from '@tanstack/react-router';

import { ErrorPage } from '@/views/error';

import { AppProviders } from '../providers/index';

export const RouteError = ({ reset }: ErrorComponentProps) => (
  <AppProviders>
    <ErrorPage reset={reset} />
  </AppProviders>
);
