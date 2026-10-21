import type { RoomMusicView } from '@/entities/room/music';

import type { MusicPlayerAdapter } from '../../../../lib/index';

export type UsePlaybackSyncInput = {
  adapter: MusicPlayerAdapter | null;
  music: RoomMusicView;
  isLive: boolean;
};
