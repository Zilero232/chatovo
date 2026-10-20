import type { MusicTrack } from '@chatovo/schemas';

import type { RoomMusicState } from '../../music.types';

export type EnqueueMusicTrackInput = {
  state: RoomMusicState;
  track: MusicTrack;
  now: number;
};
