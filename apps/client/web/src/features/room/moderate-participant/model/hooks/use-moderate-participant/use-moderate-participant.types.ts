import type { ModerateRoomParticipantInput } from '@/shared/api';

export type ModerateParticipantVariables = ModerateRoomParticipantInput & {
  userName: string;
};
