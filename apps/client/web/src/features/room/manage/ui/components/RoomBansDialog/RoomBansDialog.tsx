import type { RoomBan } from '@chatovo/schemas';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Spinner,
  Text
} from '@chatovo/ui-kit';
import { Gavel } from 'lucide-react';
import { isEmpty } from 'remeda';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import type { RoomBansDialogProps } from './RoomBansDialog.types';

import { useRoomBans, useUnbanRoomUser } from '../../../model/hooks';
import { RoomBanItem } from './components';

import s from './RoomBansDialog.module.scss';

const hasBans = (bans: RoomBan[] | undefined): bans is RoomBan[] => !isEmpty(bans ?? []);

export const RoomBansDialog = ({ open, room, onOpenChange }: RoomBansDialogProps) => {
  const t = useTranslations('roomModeration.bans');

  const { data: bans, isPending } = useRoomBans(open ? room.id : null);
  const unbanMutation = useUnbanRoomUser(room.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<Gavel />} tone='destructive'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description', { name: room.name })}</DialogDescription>
        </DialogHeader>

        {match({ isPending, bans })
          .with({ isPending: true }, () => <Spinner className={s.spinner} />)
          .with({ bans: P.when(hasBans) }, ({ bans: items }) => (
            <ul className={s.list}>
              {items.map((ban) => (
                <RoomBanItem
                  key={ban.user.id}
                  ban={ban}
                  isBusy={unbanMutation.isPending}
                  onUnban={() => unbanMutation.mutate(ban)}
                />
              ))}
            </ul>
          ))
          .otherwise(() => (
            <Text className={s.empty} size='sm' tone='muted'>
              {t('empty')}
            </Text>
          ))}
      </DialogContent>
    </Dialog>
  );
};
