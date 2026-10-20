import type { router } from './app/router';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
