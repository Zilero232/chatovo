import type { RoomMusicView } from '../../model/types';
import type { ToRoomMusicViewInput } from './to-room-music-view.types';

export const toRoomMusicView = ({ music, receivedAt }: ToRoomMusicViewInput): RoomMusicView => ({
  ...music,
  clockOffsetMs: music.serverTime - receivedAt
});
