import type { IsStaleRoomMusicInput } from './is-stale-room-music.types';

export const isStaleRoomMusic = ({ cached, music }: IsStaleRoomMusicInput): boolean =>
  cached !== undefined && cached.revision > music.revision;
