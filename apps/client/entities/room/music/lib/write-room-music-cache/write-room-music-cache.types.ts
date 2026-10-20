import type { RoomMusic } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';

export type WriteRoomMusicCacheInput = {
  queryClient: QueryClient;
  music: RoomMusic;
};
