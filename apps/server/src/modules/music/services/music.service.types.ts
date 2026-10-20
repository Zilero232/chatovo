import type { MusicEnqueueItem, MusicPlaybackCommand } from '@chatovo/schemas';

import type { RadioStationEntry } from '../music.types';

export type RoomMusicAccessInput = {
  roomId: string;
  userId: string;
};

export type EnqueueMusicInput = RoomMusicAccessInput & {
  item: MusicEnqueueItem;
};

export type DequeueMusicInput = RoomMusicAccessInput & {
  trackId: string;
};

export type ControlMusicInput = RoomMusicAccessInput & {
  command: MusicPlaybackCommand;
};

export type RadioRequestInput = {
  path: string;
  params?: Record<string, string>;
};

export type CachedRadioInput = {
  key: string[];
  load: () => Promise<RadioStationEntry[]>;
};
