import type { RoomMusic } from '@chatovo/schemas';

import type { RoomMusicView } from '../../model/types';

export type IsStaleRoomMusicInput = {
  cached: RoomMusicView | undefined;
  music: RoomMusic;
};
