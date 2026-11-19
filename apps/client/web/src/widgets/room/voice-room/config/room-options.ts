import type { RoomOptions } from 'livekit-client';

export const ROOM_MEDIA_OPTIONS = {
  webAudioMix: true,
  adaptiveStream: true,
  dynacast: true
} satisfies Partial<RoomOptions>;
