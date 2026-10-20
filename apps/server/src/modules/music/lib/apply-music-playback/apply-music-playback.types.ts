import type { MusicPlaybackCommand } from '@chatovo/schemas';

import type { RoomMusicState } from '../../music.types';

export type ApplyMusicPlaybackInput = {
  state: RoomMusicState;
  command: MusicPlaybackCommand;
  now: number;
};
