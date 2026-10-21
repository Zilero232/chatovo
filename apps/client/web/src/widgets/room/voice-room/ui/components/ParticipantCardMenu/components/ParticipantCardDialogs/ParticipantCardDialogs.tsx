import { ModerateParticipantDialog } from '@/features/room/moderate-participant';
import { BlockUserConfirmDialog } from '@/features/social/block-user';
import { ReportAbuseDialog } from '@/features/social/report-abuse';

import type { ParticipantCardDialogsProps } from './ParticipantCardDialogs.types';

export const ParticipantCardDialogs = ({
  dialogs,
  displayName,
  participant,
  roomId
}: ParticipantCardDialogsProps) => {
  const {
    isReportOpen,
    isBlockOpen,
    isModerationOpen,
    moderationAction,
    setIsReportOpen,
    setIsBlockOpen,
    setIsModerationOpen
  } = dialogs;

  return (
    <>
      <ReportAbuseDialog
        open={isReportOpen}
        target='user'
        targetId={participant.identity}
        targetName={displayName}
        onOpenChange={setIsReportOpen}
      />

      <BlockUserConfirmDialog
        open={isBlockOpen}
        userId={participant.identity}
        userName={displayName}
        onOpenChange={setIsBlockOpen}
      />

      <ModerateParticipantDialog
        action={moderationAction}
        open={isModerationOpen}
        roomId={roomId}
        userId={participant.identity}
        userName={displayName}
        onOpenChange={setIsModerationOpen}
      />
    </>
  );
};
