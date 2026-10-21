import { Badge, ConfirmDialog, IconButtonWithTooltip, Row, Stack, Text } from '@chatovo/ui-kit';
import { Gavel, KeyRound, Lock, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useDeleteRoomAsAdmin } from '@/entities/app/admin';
import { useToastError } from '@/entities/app/locale';
import { RoomBansDialog } from '@/features/room/manage';
import { formatDateTime } from '@/shared/lib';

import type { RoomRowProps } from './RoomRow.types';

import s from './RoomRow.module.scss';

export const RoomRow = ({ room }: RoomRowProps) => {
  const t = useTranslations('admin');
  const tBans = useTranslations('roomModeration.bans');
  const toastError = useToastError();
  const { isPending, mutate } = useDeleteRoomAsAdmin();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBansOpen, setIsBansOpen] = useState(false);

  const isGroup = room.kind === 'group';

  const remove = () =>
    mutate(room.id, {
      onSuccess: () => {
        toast.success(t('rooms.deleted'), { id: 'delete-room' });
        setIsConfirmOpen(false);
      },
      onError: toastError('delete-room')
    });

  return (
    <Row align='center' as='article' className={s.root} gap='3'>
      <Stack className={s.info} gap='1'>
        <Row wrap align='center' gap='2'>
          <Text truncate size='sm' weight='medium'>
            {room.name}
          </Text>

          {room.isPrivate && (
            <Badge tone='primary'>
              <Lock />
              {t('rooms.private')}
            </Badge>
          )}
          {room.hasPassword && (
            <Badge>
              <KeyRound />
              {t('rooms.password')}
            </Badge>
          )}
          {room.kind === 'dm' && <Badge>{t('rooms.dm')}</Badge>}
          {room.participants > 0 && (
            <Badge tone='primary'>{t('rooms.live', { count: room.participants })}</Badge>
          )}
        </Row>

        <Text truncate size='xs' tone='muted'>
          {t('rooms.owner')}: {room.ownerName ?? room.ownerId} ·{' '}
          {t('rooms.messages', { count: room.messagesCount })} · {formatDateTime(room.createdAt)}
        </Text>
      </Stack>

      {isGroup && (
        <IconButtonWithTooltip
          className={s.action}
          icon={<Gavel />}
          label={tBans('menu')}
          size='icon-sm'
          tooltipSide='top'
          onClick={() => setIsBansOpen(true)}
        />
      )}

      <IconButtonWithTooltip
        className={s.action}
        icon={<Trash2 />}
        label={t('rooms.delete')}
        size='icon-sm'
        tooltipSide='top'
        onClick={() => setIsConfirmOpen(true)}
      />

      <ConfirmDialog
        cancelLabel={t('cancel')}
        confirmLabel={t('rooms.delete')}
        confirmVariant='destructive'
        description={t('rooms.deleteDescription')}
        isPending={isPending}
        open={isConfirmOpen}
        title={t('rooms.deleteTitle', { name: room.name })}
        tone='destructive'
        onConfirm={remove}
        onOpenChange={setIsConfirmOpen}
      />

      {isGroup && <RoomBansDialog open={isBansOpen} room={room} onOpenChange={setIsBansOpen} />}
    </Row>
  );
};
