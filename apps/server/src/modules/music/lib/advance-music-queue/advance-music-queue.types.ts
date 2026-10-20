import type { RoomMusicState } from '../../music.types';

export type AdvanceMusicQueueInput = {
  state: RoomMusicState;
  now: number;
  remember?: boolean;
};
