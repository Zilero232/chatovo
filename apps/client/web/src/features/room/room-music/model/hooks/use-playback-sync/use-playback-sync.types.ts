import type { RoomMusicView } from '@/entities/room/music';

import type { MusicPlayerAdapter } from '../../../lib';

export type UsePlaybackSyncInput = {
  adapter: MusicPlayerAdapter | null;
  music: RoomMusicView;
  isLive: boolean;
};
