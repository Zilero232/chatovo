'use client';

import { ConfirmDialog, Text } from '@chatovo/ui-kit';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useDeleteRoom } from '@/entities/room/room';
import { useRoomSession } from '@/entities/room/session';
import { ROUTES } from '@/shared/constants';

import type { DeleteRoomDialogProps } from './DeleteRoomDialog.types';

export const DeleteRoomDialog = ({ room, open, onOpenChange }: DeleteRoomDialogProps) => {
  const t = useTranslations('manageRoom.delete');
  const toastError = useToastError();

  const router = useRouter();
  const params = useSearchParams();

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
        close(room.id);

        if (params.get('id') === room.id) {
          router.replace(ROUTES.lobby);
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
