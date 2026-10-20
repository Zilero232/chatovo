import type { VoiceRoomProps } from '../../../ui/VoiceRoom.types';

export type UseRoomConnectionInput = Pick<
  VoiceRoomProps,
  'onConnectFailure' | 'onLeave' | 'roomId'
>;
