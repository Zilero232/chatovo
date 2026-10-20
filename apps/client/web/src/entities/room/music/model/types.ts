import type { RoomMusic } from '@chatovo/schemas';

export type RoomMusicView = RoomMusic & {
  clockOffsetMs: number;
};
