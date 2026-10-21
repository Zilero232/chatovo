import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator
} from '@chatovo/ui-kit';
import { useParticipantPermissions } from '@livekit/components-react';
import { Gavel, Mic, MicOff, UserX } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { isMicLocked } from '@/entities/room/room';

import type { ParticipantModerationItemsProps } from './ParticipantModerationItems.types';

import { useModerateParticipant } from '../../model/hooks';

export const ParticipantModerationItems = ({
  participant,
  roomId,
  onRequestConfirm
}: ParticipantModerationItemsProps) => {
  const t = useTranslations('roomModeration');

  const permissions = useParticipantPermissions({ participant });
  const moderateMutation = useModerateParticipant();

  const isMuted = isMicLocked(permissions);

  const toggleMute = () => {
    moderateMutation.mutate({
      roomId,
      userId: participant.identity,
      userName: participant.name || participant.identity,
      action: isMuted ? 'unmute' : 'mute'
    });
  };

  return (
    <>
      <ContextMenuSeparator />

      <ContextMenuGroup>
        <ContextMenuLabel>{t('label')}</ContextMenuLabel>

        <ContextMenuItem onSelect={toggleMute}>
          {isMuted ? <Mic /> : <MicOff />}
          {t(isMuted ? 'unmute' : 'mute')}
        </ContextMenuItem>

        <ContextMenuItem variant='destructive' onSelect={() => onRequestConfirm('remove')}>
          <UserX />
          {t('remove')}
        </ContextMenuItem>

        <ContextMenuItem variant='destructive' onSelect={() => onRequestConfirm('ban')}>
          <Gavel />
          {t('ban')}
        </ContextMenuItem>
      </ContextMenuGroup>
    </>
  );
};
