import type { Room } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';

export type UpsertRoomInCacheInput = {
  queryClient: QueryClient;
  room: Room;
};

export type RemoveRoomFromCacheInput = {
  queryClient: QueryClient;
  roomId: string;
};
