import { Button } from '@chatovo/ui-kit';
import { Check, X } from 'lucide-react';
import { useFormatter, useNow, useTranslations } from 'use-intl';

import { UserAvatar, UserName } from '@/entities/auth/user';

import type { FriendRequestListItemProps } from './FriendRequestListItem.types';

import s from './FriendRequestListItem.module.scss';

export const FriendRequestListItem = ({
  entry,
  isAccepting,
  isDeclining,
  onAccept,
  onDecline
}: FriendRequestListItemProps) => {
  const t = useTranslations('friends');
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });

  const { user } = entry;
  const busy = isAccepting || isDeclining;

  return (
    <div className={s.root}>
      <UserAvatar className={s.avatar} name={user.name} size='sm' src={user.avatarUrl} />
      <div className={s.info}>
        <UserName
          className={s.name}
          developer={user.developer}
          name={user.name}
          verified={user.verified}
        />
        <span className={s.meta}>{format.relativeTime(new Date(entry.requestedAt), now)}</span>
      </div>
      <div className={s.actions}>
        <Button
          aria-label={t('accept')}
          className={s.accept}
          disabled={busy}
          size='icon-sm'
          title={t('accept')}
          onClick={onAccept}
        >
          <Check aria-hidden />
        </Button>
        <Button
          aria-label={t('decline')}
          className={s.decline}
          disabled={busy}
          size='icon-sm'
          title={t('decline')}
          variant='secondary'
          onClick={onDecline}
        >
          <X aria-hidden />
        </Button>
      </div>
    </div>
  );
};
