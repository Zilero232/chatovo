import type { ConfirmableModerationAction } from '../../model/types';

export type ModerateParticipantDialogProps = {
  action: ConfirmableModerationAction;
  open: boolean;
  roomId: string;
  userId: string;
  userName: string;
  onOpenChange: (open: boolean) => void;
};
