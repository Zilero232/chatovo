import type { Participant } from 'livekit-client';

import type { ConfirmableModerationAction } from '../../model/types';

export type ParticipantModerationItemsProps = {
  participant: Participant;
  roomId: string;
  onRequestConfirm: (action: ConfirmableModerationAction) => void;
};
