export const FRIEND_CALL_SOUND_SRC = {
  incoming: '/audios/call/incoming.mp3',
  outgoing: '/audios/call/outgoing.mp3'
} as const;

export type FriendCallSoundKind = keyof typeof FRIEND_CALL_SOUND_SRC;
