import type { RoomMusicState } from '../../music.types';

export type RewindMusicQueueInput = {
  state: RoomMusicState;
  now: number;
};
