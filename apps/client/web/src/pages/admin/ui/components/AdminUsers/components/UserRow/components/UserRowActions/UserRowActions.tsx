import { IconButtonWithTooltip, Row } from '@chatovo/ui-kit';
import { Ban, Eye, Pencil, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useUnblockUser } from '@/entities/app/admin';
import { useToastError } from '@/entities/app/locale';

import type { UserRowActionsProps } from './UserRowActions.types';

import { useUserAccess } from '../../../../../../../model/hooks';

import s from '../../UserRow.module.scss';

export const UserRowActions = ({ user, onBlock, onEdit, onShowDetails }: UserRowActionsProps) => {
  const t = useTranslations('admin');
  const toastError = useToastError();

  const unblock = useUnblockUser();
  const { canManage, canBlock } = useUserAccess(user);

  const handleUnblock = () =>
    unblock.mutate(user.id, {
      onSuccess: () => toast.success(t('users.unblocked_toast'), { id: 'unblock-user' }),
      onError: toastError('unblock-user')
    });

  return (
    <Row className={s.actions} gap='1'>
      <IconButtonWithTooltip
        icon={<Eye />}
        label={t('users.details')}
        size='icon-sm'
        tooltipSide='top'
        onClick={onShowDetails}
      />

      {canManage && (
        <IconButtonWithTooltip
          icon={<Pencil />}
          label={t('users.edit')}
          size='icon-sm'
          tooltipSide='top'
          onClick={onEdit}
        />
      )}

      {canBlock && user.blockedAt !== null && (
        <IconButtonWithTooltip
          disabled={unblock.isPending}
          icon={<ShieldOff />}
          label={t('users.unblock')}
          size='icon-sm'
          tooltipSide='top'
          onClick={handleUnblock}
        />
      )}

      {canBlock && user.blockedAt === null && (
        <IconButtonWithTooltip
          icon={<Ban />}
          label={t('users.block')}
          size='icon-sm'
          tooltipSide='top'
          onClick={onBlock}
        />
      )}
    </Row>
  );
};
