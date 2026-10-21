import type { Participant } from 'livekit-client';

import { useCopy } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import type { ConfirmableModerationAction } from '@/features/room/moderate-participant';

import { useCurrentUser } from '@/entities/auth/user';
import { readParticipantMeta, useCanModerateRoom } from '@/entities/room/room';
import { useIsUserBlocked } from '@/entities/social/friend';
import { useUnblockUser } from '@/features/social/block-user';

import { useCurrentRoomId } from './use-current-room-id';

export const useParticipantCardMenu = (participant: Participant) => {
  const t = useTranslations('participant');

  const { user } = useCurrentUser();
  const roomId = useCurrentRoomId();

  const isBlocked = useIsUserBlocked(participant.identity);
  const { unblock } = useUnblockUser();
  const { canModerate, ownerId } = useCanModerateRoom(roomId);

  const { copy } = useCopy();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [isModerationOpen, setIsModerationOpen] = useState(false);
  const [moderationAction, setModerationAction] = useState<ConfirmableModerationAction>('remove');

  const { identity, metadata } = participant;
  const displayName = participant.name || identity;
  const isSelf = identity === user?.id;
  const isProtected = isSelf || identity === ownerId || readParticipantMeta(metadata).developer;

  const copyName = async () => {
    await copy(displayName);

    toast.success(t('nameCopied'), { id: 'participant-name-copied' });
  };

  const toggleBlock = () => {
    if (isBlocked) {
      unblock({ userId: identity, userName: displayName });

      return;
    }

    setIsBlockOpen(true);
  };

  const requestModeration = (action: ConfirmableModerationAction) => {
    setModerationAction(action);
    setIsModerationOpen(true);
  };

  return {
    displayName,
    roomId,
    isSelf,
    isBlocked,
    canModerate: canModerate && !isProtected,
    dialogs: {
      isReportOpen,
      isBlockOpen,
      isModerationOpen,
      moderationAction,
      setIsReportOpen,
      setIsBlockOpen,
      setIsModerationOpen
    },
    copyName,
    toggleBlock,
    openReport: () => setIsReportOpen(true),
    requestModeration
  };
};
