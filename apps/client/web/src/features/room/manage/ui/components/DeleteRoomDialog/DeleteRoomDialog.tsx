import { ConfirmDialog, Text } from '@chatovo/ui-kit';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useDeleteRoom } from '@/entities/room/room';
import { useRoomSession } from '@/entities/room/session';
import { ROUTES } from '@/shared/constants';

import type { DeleteRoomDialogProps } from './DeleteRoomDialog.types';

export const DeleteRoomDialog = ({ room, open, onOpenChange }: DeleteRoomDialogProps) => {
  const t = useTranslations('manageRoom.delete');
  const toastError = useToastError();

  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const { close } = useRoomSession();

  const deleteMutation = useDeleteRoom();

  const onConfirm = () => {
    deleteMutation.mutate(room.id, {
      onSuccess: () => {
        toast.success(t('deleted'), {
          id: `room-delete-${room.id}`,
          description: `"${room.name}"`
        });
        onOpenChange(false);
        close(room.id, { guardRejoin: search.id === room.id });

        if (search.id === room.id) {
          navigate({ to: ROUTES.lobby, replace: true });
        }
      },
      onError: toastError(`room-delete-${room.id}`)
    });
  };

  return (
    <ConfirmDialog
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
      description={t('description')}
      hint={t('hint')}
      icon={<Trash2 />}
      isPending={deleteMutation.isPending}
      open={open}
      title={t('title', { name: room.name })}
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
    >
      <Text size='sm' tone='destructive'>
        {t('consequences')}
      </Text>
    </ConfirmDialog>
  );
};
