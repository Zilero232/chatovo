import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@chatovo/ui-kit';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'use-intl';

import type { UserDetailsDialogProps } from './UserDetailsDialog.types';

import { UserMessagesPanel, UserOverviewPanel } from './components';

import s from './UserDetailsDialog.module.scss';

type Panel = 'messages' | 'overview';

export const UserDetailsDialog = ({ user, open, onOpenChange }: UserDetailsDialogProps) => {
  const t = useTranslations('admin');

  const [panel, setPanel] = useState<Panel>('overview');

  const name = user.displayName ?? user.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content}>
        <DialogHeader icon={<Eye />} tone='cyan'>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>

        <Tabs value={panel} onValueChange={(value) => setPanel(value as Panel)}>
          <TabsList className={s.tabs}>
            <TabsTrigger value='overview'>{t('users.overview')}</TabsTrigger>
            <TabsTrigger value='messages'>{t('users.messagesTitle')}</TabsTrigger>
          </TabsList>

          <TabsContent value='overview'>
            <UserOverviewPanel enabled={open && panel === 'overview'} userId={user.id} />
          </TabsContent>

          <TabsContent value='messages'>
            <UserMessagesPanel enabled={open && panel === 'messages'} userId={user.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
