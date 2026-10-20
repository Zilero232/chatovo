import type { Room } from '@chatovo/schemas';

import { filter } from 'remeda';

import { QUERY_KEYS } from '@/shared/constants';

import type { RemoveRoomFromCacheInput, UpsertRoomInCacheInput } from './room-cache.types';

export const upsertRoomInCache = ({ queryClient, room }: UpsertRoomInCacheInput) => {
  queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (rooms) => {
    if (!rooms) {
      return rooms;
    }

    const isKnown = rooms.some(({ id }) => id === room.id);

    return isKnown
      ? rooms.map((current) => (current.id === room.id ? room : current))
      : [room, ...rooms];
  });
  queryClient.setQueryData<Room>(QUERY_KEYS.room(room.id), room);
};

export const removeRoomFromCache = ({ queryClient, roomId }: RemoveRoomFromCacheInput) => {
  queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (rooms) =>
    rooms ? filter(rooms, ({ id }) => id !== roomId) : rooms
  );
  queryClient.removeQueries({ queryKey: QUERY_KEYS.room(roomId) });
};
