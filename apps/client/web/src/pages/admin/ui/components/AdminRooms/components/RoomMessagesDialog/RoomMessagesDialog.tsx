import {
  CenteredState,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ScrollArea,
  Spinner,
  Stack
} from '@chatovo/ui-kit';
import { MessageSquareOff, MessagesSquare } from 'lucide-react';
import { useState } from 'react';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useAdminRoomMessages } from '@/entities/app/admin';

import type { RoomMessagesDialogProps } from './RoomMessagesDialog.types';

import { AdminPagination } from '../../../AdminPagination/AdminPagination';
import { RoomMessageItem } from './components';

import s from './RoomMessagesDialog.module.scss';

const PER_PAGE = 30;

export const RoomMessagesDialog = ({ room, open, onOpenChange }: RoomMessagesDialogProps) => {
  const t = useTranslations('admin');

  const [page, setPage] = useState(1);

  const { data, isPending } = useAdminRoomMessages({
    roomId: room.id,
    query: { page, perPage: PER_PAGE },
    enabled: open
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content}>
        <DialogHeader icon={<MessagesSquare />} tone='cyan'>
          <DialogTitle>{room.name}</DialogTitle>
          <DialogDescription>{t('rooms.historyHint')}</DialogDescription>
        </DialogHeader>

        <Stack gap='3'>
          {match({ isPending, items: data?.items })
            .with({ isPending: true }, () => <Spinner className={s.spinner} />)
            .with({ items: P.when((list) => (list?.length ?? 0) > 0) }, ({ items }) => (
              <ScrollArea className={s.list}>
                <Stack gap='2'>
                  {items?.map((message) => (
                    <RoomMessageItem key={message.id} message={message} />
                  ))}
                </Stack>
              </ScrollArea>
            ))
            .otherwise(() => (
              <CenteredState icon={<MessageSquareOff />} title={t('users.messagesEmpty')} />
            ))}

          <AdminPagination
            page={page}
            perPage={PER_PAGE}
            total={data?.total ?? 0}
            onPageChange={setPage}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
