'use client';

import { UserName } from '@/entities/auth/user';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { formatMessageTime } from '@/shared/lib/format-date';
import { FriendProfileActionsPanel } from '@/widgets/social/friend-profile-actions-panel';

import { useChatMessage } from '../../../../../model/contexts';

import s from './MessageMeta.module.scss';

export const MessageMeta = () => {
  const { author, identity, verified, developer, isOwn, message } = useChatMessage();

  return (
    <div className={s.root}>
      {!isOwn && (
        <ProfileCardTrigger
          className={s.nameTrigger}
          identity={identity}
          name={author}
          renderFriendActions={(state) => <FriendProfileActionsPanel {...state} />}
        >
          <UserName className={s.author} developer={developer} name={author} verified={verified} />
        </ProfileCardTrigger>
      )}
      <span className={s.time}>{formatMessageTime(message.timestamp)}</span>
    </div>
  );
};
