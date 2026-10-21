import { ConfirmDialog, Text } from '@chatovo/ui-kit';
import { Ban } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { BlockUserConfirmDialogProps } from './BlockUserConfirmDialog.types';

import { useBlockUser } from '../../model/hooks';

export const BlockUserConfirmDialog = ({
  open,
  userId,
  userName,
  onOpenChange
}: BlockUserConfirmDialogProps) => {
  const t = useTranslations('blocks.confirm');

  const { isPending, block } = useBlockUser();

  const handleConfirm = () => {
    block({ userId, userName, onBlocked: () => onOpenChange(false) });
  };

  return (
    <ConfirmDialog
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
      description={t('description', { name: userName })}
      icon={<Ban />}
      isPending={isPending}
      open={open}
      title={t('title', { name: userName })}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <Text size='sm' tone='muted'>
        {t('consequences')}
      </Text>
    </ConfirmDialog>
  );
};
