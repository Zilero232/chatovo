'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButtonWithTooltip
} from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { MessageCircle, MoreVertical, UserMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { UserAvatar, UserName } from '@/entities/auth/user';
import { formatBadgeCount } from '@/shared/lib';

import type { FriendListItemProps } from './FriendListItem.types';

import s from './FriendListItem.module.scss';

export const FriendListItem = ({ dmUnread = 0, user, onOpen, onRemove }: FriendListItemProps) => {
  const t = useTranslations('friends');

  return (
    <div className={s.root}>
      <button className={s.main} type='button' onClick={() => onOpen(user)}>
        <span className={s.avatarSlot}>
          <UserAvatar className={s.avatar} name={user.name} size='sm' src={user.avatarUrl} />
          <span className={clsx(s.presence, { [s.presenceOnline]: user.isOnline })} />
        </span>

        <div className={s.info}>
          <UserName
            className={s.name}
            developer={user.developer}
            name={user.name}
            verified={user.verified}
          />
          <span className={s.status}>{t(user.isOnline ? 'online' : 'offline')}</span>
        </div>
      </button>

      <div className={s.actions}>
        <span className={s.messageSlot}>
          <IconButtonWithTooltip
            className={s.action}
            icon={<MessageCircle />}
            label={t('messageFriend')}
            variant='ghost'
            onClick={() => onOpen(user)}
          />

          {dmUnread > 0 && (
            <span
              aria-live='polite'
              className={s.unread}
              title={t('unreadMessages', { count: dmUnread })}
            >
              {formatBadgeCount(dmUnread)}
            </span>
          )}
        </span>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            aria-label={t('friendActions')}
            className={s.action}
            size='icon-sm'
            type='button'
            variant='ghost'
          >
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem className={s.menuItemDestructive} onClick={() => onRemove(user)}>
              <UserMinus />
              {t('removeFriend')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
