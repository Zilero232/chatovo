import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@chatovo/ui-kit';
import { Copy } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ParticipantModerationItems } from '@/features/room/moderate-participant';

import type { ParticipantCardMenuProps } from './ParticipantCardMenu.types';

import { useParticipantCardMenu } from '../../../model/hooks';
import { ParticipantVolumeControls } from '../ParticipantVolumeControls/ParticipantVolumeControls';
import { ParticipantCardDialogs, ParticipantSafetyItems } from './components';

import s from './ParticipantCardMenu.module.scss';

export const ParticipantCardMenu = ({ participant, children }: ParticipantCardMenuProps) => {
  const t = useTranslations('participant');

  const {
    displayName,
    roomId,
    isSelf,
    isBlocked,
    canModerate,
    dialogs,
    copyName,
    toggleBlock,
    openReport,
    requestModeration
  } = useParticipantCardMenu(participant);

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent className={s.content}>
        <ContextMenuGroup>
          <ContextMenuLabel className={s.header}>{displayName}</ContextMenuLabel>
        </ContextMenuGroup>

        <ParticipantVolumeControls displayName={displayName} participant={participant} />

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={copyName}>
          <Copy />
          {t('copyName')}
        </ContextMenuItem>

        {!isSelf && (
          <ParticipantSafetyItems
            isBlocked={isBlocked}
            onReport={openReport}
            onToggleBlock={toggleBlock}
          />
        )}

        {canModerate && (
          <ParticipantModerationItems
            participant={participant}
            roomId={roomId}
            onRequestConfirm={requestModeration}
          />
        )}
      </ContextMenuContent>

      <ParticipantCardDialogs
        dialogs={dialogs}
        displayName={displayName}
        participant={participant}
        roomId={roomId}
      />
    </ContextMenu>
  );
};
