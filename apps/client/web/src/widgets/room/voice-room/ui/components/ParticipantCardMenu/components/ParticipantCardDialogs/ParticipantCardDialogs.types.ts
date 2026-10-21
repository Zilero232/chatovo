import type { Participant } from 'livekit-client';

import type { useParticipantCardMenu } from '../../../../../model/hooks';

export type ParticipantCardDialogsProps = {
  dialogs: ReturnType<typeof useParticipantCardMenu>['dialogs'];
  displayName: string;
  participant: Participant;
  roomId: string;
};
