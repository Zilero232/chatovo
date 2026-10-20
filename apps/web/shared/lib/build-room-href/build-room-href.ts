import { ROUTES } from '@/shared/constants';

import type { BuildRoomHrefOptions } from './build-room-href.types';

/** The room lives at a query param, not a path segment: the static export has no SPA fallback. */
export const buildRoomHref = (roomId: string, options?: BuildRoomHrefOptions) => {
  const params = new URLSearchParams({ id: roomId });

  if (options?.view) {
    params.set('view', options.view);
  }

  if (options?.title) {
    params.set('title', options.title);
  }

  return `${ROUTES.room}?${params.toString()}`;
};
