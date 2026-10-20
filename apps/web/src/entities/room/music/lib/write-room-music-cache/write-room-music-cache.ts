import { QUERY_KEYS } from '@/shared/constants';

import type { RoomMusicView } from '../../model/types';
import type { WriteRoomMusicCacheInput } from './write-room-music-cache.types';

import { isStaleRoomMusic } from '../is-stale-room-music';
import { toRoomMusicView } from '../to-room-music-view';

export const writeRoomMusicCache = ({ queryClient, music }: WriteRoomMusicCacheInput): void => {
  const key = QUERY_KEYS.roomMusic(music.roomId);
  const cached = queryClient.getQueryData<RoomMusicView>(key);

  if (isStaleRoomMusic({ cached, music })) {
    return;
  }

  queryClient.setQueryData(key, toRoomMusicView({ music, receivedAt: Date.now() }));
};
