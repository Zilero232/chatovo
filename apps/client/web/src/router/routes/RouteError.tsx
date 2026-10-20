import type { ErrorComponentProps } from '@tanstack/react-router';

import { ErrorPage } from '@/pages/error';

import { AppProviders } from '../../providers';

export const RouteError = ({ reset }: ErrorComponentProps) => (
  <AppProviders>
    <ErrorPage reset={reset} />
  </AppProviders>
);
