import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Gavel, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'use-intl';

import { useCurrentUser } from '@/entities/auth/user';
import { useCanModerateRoom } from '@/entities/room/room';

import type { ManageRoomMenuProps } from './ManageRoomMenu.types';

import { DeleteRoomDialog, EditRoomDialog, RoomBansDialog } from './components';

import s from './ManageRoomMenu.module.scss';

export const ManageRoomMenu = ({ room, className }: ManageRoomMenuProps) => {
  const t = useTranslations('manageRoom.menu');
  const tModeration = useTranslations('roomModeration.bans');

  const { user } = useCurrentUser();
  const { canModerate } = useCanModerateRoom(room.id);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bansOpen, setBansOpen] = useState(false);

  const isOwner = user?.id === room.ownerId;

  if (!isOwner && !canModerate) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t('open')}
          className={clsx(s.trigger, className)}
          size='icon'
          variant='ghost'
          onPointerDown={(event) => event.stopPropagation()}
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onClick={(event) => event.stopPropagation()}>
          {isOwner && (
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Pencil />
              {t('edit')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setBansOpen(true)}>
            <Gavel />
            {tModeration('menu')}
          </DropdownMenuItem>
          {isOwner && (
            <DropdownMenuItem variant='destructive' onSelect={() => setDeleteOpen(true)}>
              <Trash2 />
              {t('delete')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditRoomDialog open={editOpen} room={room} onOpenChange={setEditOpen} />
      <RoomBansDialog open={bansOpen} room={room} onOpenChange={setBansOpen} />
      <DeleteRoomDialog open={deleteOpen} room={room} onOpenChange={setDeleteOpen} />
    </>
  );
};
