import { ConfirmDialog } from '@chatovo/ui-kit';
import { Gavel, UserX } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { ModerateParticipantDialogProps } from './ModerateParticipantDialog.types';

import { useModerateParticipant } from '../../model/hooks';

export const ModerateParticipantDialog = ({
  action,
  open,
  roomId,
  userId,
  userName,
  onOpenChange
}: ModerateParticipantDialogProps) => {
  const t = useTranslations('roomModeration.confirm');

  const moderateMutation = useModerateParticipant();

  const handleConfirm = () => {
    moderateMutation.mutate(
      { roomId, userId, userName, action },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <ConfirmDialog
      cancelLabel={t('cancel')}
      confirmLabel={t(`${action}.confirm`)}
      description={t(`${action}.description`, { name: userName })}
      icon={action === 'ban' ? <Gavel /> : <UserX />}
      isPending={moderateMutation.isPending}
      open={open}
      title={t(`${action}.title`, { name: userName })}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    />
  );
};
