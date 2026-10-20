import { Button } from '@chatovo/ui-kit';
import { ArrowLeft, Phone } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';
import { useCallFriend } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { ChatConversation, ChatLoadingSkeleton } from '@/widgets/chat/chat-panel';

import type { FriendChatPanelProps } from './FriendChatPanel.types';

import s from './FriendChatPanel.module.scss';

export const FriendChatPanel = ({ peer }: FriendChatPanelProps) => {
  const t = useTranslations('friends');
  const toastError = useToastError();

  const { user } = useCurrentUser();
  const { session, isOpening, close } = useFriendChat();
  const callFriend = useCallFriend();

  const roomId = session?.roomId ?? null;
  const currentUserId = user?.id ?? '';

  const handleCall = () => {
    callFriend.mutate({ userId: peer.id }, { onError: toastError(`friend-call-${peer.id}`) });
  };

  return (
    <section className={s.root}>
      <header className={s.header}>
        <Button
          aria-label={t('backToFriends')}
          className={s.back}
          size='icon-sm'
          type='button'
          variant='ghost'
          onClick={close}
        >
          <ArrowLeft />
        </Button>

        <div className={s.headerMain}>
          <UserAvatar name={peer.name} size='sm' src={peer.avatarUrl} />
          <span className={s.name}>
            <UserName developer={peer.developer} name={peer.name} verified={peer.verified} />
          </span>
        </div>

        <Button
          aria-label={t('callFriend')}
          disabled={callFriend.isPending || isOpening || !roomId}
          size='icon-sm'
          type='button'
          variant='ghost'
          onClick={handleCall}
        >
          <Phone />
        </Button>
      </header>

      <div className={s.body}>
        {isOpening || !roomId ? (
          <ChatLoadingSkeleton />
        ) : (
          <ChatConversation currentUserId={currentUserId} roomId={roomId} />
        )}
      </div>
    </section>
  );
};
