import type { MusicEnqueueItem, MusicPlaybackCommand } from '@chatovo/schemas';

export type EnqueueRoomMusicInput = {
  roomId: string;
  item: MusicEnqueueItem;
};

export type DequeueRoomMusicInput = {
  roomId: string;
  trackId: string;
};

export type ControlRoomMusicInput = {
  roomId: string;
  command: MusicPlaybackCommand;
};
