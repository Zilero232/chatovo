import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@chatovo/ui-kit';
import { useCopy } from '@siberiacancode/reactuse';
import { Copy, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useCurrentUser } from '@/entities/auth/user';
import { ReportAbuseDialog } from '@/features/social/report-abuse';

import type { ParticipantCardMenuProps } from './ParticipantCardMenu.types';

import { ParticipantVolumeControls } from '../ParticipantVolumeControls/ParticipantVolumeControls';

import s from './ParticipantCardMenu.module.scss';

export const ParticipantCardMenu = ({ participant, children }: ParticipantCardMenuProps) => {
  const t = useTranslations('participant');
  const tModeration = useTranslations('moderation');

  const { user } = useCurrentUser();

  const { copy } = useCopy();

  const [isReportOpen, setIsReportOpen] = useState(false);

  const displayName = participant.name || participant.identity;
  const isSelf = participant.identity === user?.id;

  const handleCopyName = async () => {
    await copy(displayName);

    toast.success(t('nameCopied'), { id: 'participant-name-copied' });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent className={s.content}>
        <ContextMenuGroup>
          <ContextMenuLabel>{displayName}</ContextMenuLabel>
        </ContextMenuGroup>

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={handleCopyName}>
          <Copy />
          {t('copyName')}
        </ContextMenuItem>

        <ParticipantVolumeControls displayName={displayName} participant={participant} />

        {!isSelf && (
          <>
            <ContextMenuSeparator />

            <ContextMenuItem variant='destructive' onSelect={() => setIsReportOpen(true)}>
              <ShieldAlert />
              {tModeration('reportUser')}
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>

      <ReportAbuseDialog
        open={isReportOpen}
        target='user'
        targetId={participant.identity}
        targetName={displayName}
        onOpenChange={setIsReportOpen}
      />
    </ContextMenu>
  );
};
