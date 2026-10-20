import { Button } from '@chatovo/ui-kit';
import { MessageSquare, Phone, UserMinus } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { FriendActionsProps } from './FriendActions.types';

import s from '../../FriendProfileActions.module.scss';

export const FriendActions = ({ isBusy, onCall, onOpenChat, onRemove }: FriendActionsProps) => {
  const t = useTranslations('friends');

  return (
    <div className={s.friendsSection}>
      <div className={s.friendsPrimary}>
        <Button
          className={s.friendsAction}
          disabled={isBusy}
          size='sm'
          variant='outline'
          onClick={onOpenChat}
        >
          <MessageSquare aria-hidden />
          {t('messageFriend')}
        </Button>
        <Button className={s.friendsAction} disabled={isBusy} size='sm' onClick={onCall}>
          <Phone aria-hidden />
          {t('callFriend')}
        </Button>
      </div>
      <Button
        className={s.friendsRemove}
        disabled={isBusy}
        size='sm'
        variant='ghost'
        onClick={onRemove}
      >
        <UserMinus aria-hidden />
        {t('removeFriend')}
      </Button>
    </div>
  );
};
