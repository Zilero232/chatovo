import type { RoomParticipant } from '@chatovo/schemas';
import type { Participant } from 'livekit-client';

export type DmStageProps = {
  isSelfInvisible: boolean;
  localParticipant?: Participant;
  peerParticipant?: Participant;
  presenceByIdentity: Record<string, RoomParticipant>;
};
