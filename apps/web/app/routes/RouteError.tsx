'use client';

import { ErrorPage } from '@/views/error';

import { AppProviders } from './providers/index';

type ErrorProps = {
  reset: () => void;
};

const RouteError = ({ reset }: ErrorProps) => (
  <AppProviders>
    <ErrorPage reset={reset} />
  </AppProviders>
);

export default RouteError;
