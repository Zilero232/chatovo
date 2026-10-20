import { ROUTES } from '@/shared/constants';

import type { BuildRoomHrefOptions, RoomSearch } from './build-room-href.types';

/** The room's search params for a typed `navigate({ to: ROUTES.room, search })`; empty options are dropped. */
export const buildRoomSearch = (roomId: string, options?: BuildRoomHrefOptions): RoomSearch => {
  const search: RoomSearch = { id: roomId };

  if (options?.view) {
    search.view = options.view;
  }

  if (options?.title) {
    search.title = options.title;
  }

  return search;
};

/** The room lives at a query param, not a path segment, so invite links stay `/room?id=…`. */
export const buildRoomHref = (roomId: string, options?: BuildRoomHrefOptions) => {
  const params = new URLSearchParams(buildRoomSearch(roomId, options));

  return `${ROUTES.room}?${params.toString()}`;
};
