'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogHint,
  DialogTitle
} from '@chatovo/ui-kit';
import { useBoolean } from '@siberiacancode/reactuse';
import { Plus, Radio } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { CreateRoomDialogProps } from './CreateRoomDialog.types';

import { CreateRoomForm } from './components';

export const CreateRoomDialog = ({ trigger }: CreateRoomDialogProps) => {
  const t = useTranslations('createRoom');
  const [isOpen, toggleOpen] = useBoolean(false);

  return (
    <Dialog
      trigger={
        trigger ?? (
          <Button type='button'>
            <Plus />
            {t('trigger')}
          </Button>
        )
      }
      open={isOpen}
      onOpenChange={toggleOpen}
    >
      <DialogContent>
        <DialogHeader icon={<Radio />} tone='violet'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <CreateRoomForm
          hint={<DialogHint>{t('hint')}</DialogHint>}
          onCreated={() => toggleOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
