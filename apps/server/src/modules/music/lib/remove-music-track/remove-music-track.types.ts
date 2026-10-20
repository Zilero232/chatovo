import type { RoomMusicState } from '../../music.types';

export type RemoveMusicTrackInput = {
  state: RoomMusicState;
  trackId: string;
  now: number;
};
