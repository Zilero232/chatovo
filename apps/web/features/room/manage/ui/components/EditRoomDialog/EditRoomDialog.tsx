'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogHint,
  DialogTitle
} from '@chatovo/ui-kit';
import { Settings2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { EditRoomDialogProps } from './EditRoomDialog.types';

import { EditRoomForm } from './EditRoomForm';

export const EditRoomDialog = ({ room, open, onOpenChange }: EditRoomDialogProps) => {
  const t = useTranslations('manageRoom.edit');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<Settings2 />} tone='cyan'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <EditRoomForm room={room} onUpdated={() => onOpenChange(false)} />

        <DialogHint>{t('hint')}</DialogHint>
      </DialogContent>
    </Dialog>
  );
};
