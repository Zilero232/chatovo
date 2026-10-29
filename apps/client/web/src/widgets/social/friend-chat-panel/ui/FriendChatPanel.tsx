import { Button } from '@chatovo/ui-kit';
import { ArrowLeft, Phone } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useTranslations } from 'use-intl';

import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';
import { useFriendChat } from '@/features/social/friend-chat';
import { ChatConversation, ChatLoadingSkeleton } from '@/widgets/chat/chat-panel';

import type { FriendChatPanelProps } from './FriendChatPanel.types';

import { useFriendCall } from '../model/hooks';
import { FriendCallBanner } from './components';

import s from './FriendChatPanel.module.scss';

export const FriendChatPanel = ({ peer }: FriendChatPanelProps) => {
  const t = useTranslations('friends');

  const { user } = useCurrentUser();
  const { session, isOpening, close } = useFriendChat();
  const call = useFriendCall(peer.id);

  const roomId = session?.roomId ?? null;
  const currentUserId = user?.id ?? '';

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
          disabled={call.isStarting || call.status !== 'idle' || isOpening || !roomId}
          size='icon-sm'
          type='button'
          variant='ghost'
          onClick={call.start}
        >
          <Phone />
        </Button>
      </header>

      <AnimatePresence initial={false}>
        {call.status !== 'idle' && (
          <FriendCallBanner duration={call.duration} status={call.status} onJoin={call.join} />
        )}
      </AnimatePresence>

      <div className={s.body}>
        {isOpening || !roomId ? (
          <ChatLoadingSkeleton />
        ) : (
          <ChatConversation currentUserId={currentUserId} peerId={peer.id} roomId={roomId} />
        )}
      </div>
    </section>
  );
};
