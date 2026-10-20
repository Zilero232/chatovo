import type { SoundCategory } from '@/entities/app/settings';

export const SOUND_SRC = {
  join: '/audios/room/join.mp3',
  reconnect: '/audios/room/reconnect.mp3',
  mute: '/audios/room/mute.mp3',
  unmute: '/audios/room/unmute.mp3',
  ptt: '/audios/room/ptt.mp3',
  deafen: '/audios/room/deafen.mp3',
  undeafen: '/audios/room/undeafen.mp3',
  message: '/audios/ui/notification.mp3',
  reaction: '/audios/ui/reaction.mp3'
} as const;

export type SoundKey = keyof typeof SOUND_SRC;

export const SOUND_CATEGORY: Record<SoundKey, SoundCategory> = {
  join: 'join',
  reconnect: 'reconnect',
  mute: 'mute',
  unmute: 'mute',
  ptt: 'mute',
  deafen: 'mute',
  undeafen: 'mute',
  message: 'message',
  reaction: 'reaction'
};
