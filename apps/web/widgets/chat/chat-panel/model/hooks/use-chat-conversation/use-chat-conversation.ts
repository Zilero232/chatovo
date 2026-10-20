'use client';

import { useAutoScroll } from '@siberiacancode/reactuse';
import { isEmpty } from 'remeda';

import { useRealtimeSubscribe } from '@/entities/app/realtime';
import { useCurrentUser } from '@/entities/auth/user';

import type { UseChatConversationParams } from './use-chat-conversation.types';

import { groupChatLines } from '../../lib';
import { useChatFiles } from '../use-chat-files';
import { useChatHistory } from '../use-chat-history';
import { useChatOlderLoader } from '../use-chat-older-loader';
import { useChatSend } from '../use-chat-send';
import { useChatSync } from '../use-chat-sync';

export const useChatConversation = ({
  roomId,
  currentUserId,
  enabled
}: UseChatConversationParams) => {
  useRealtimeSubscribe([roomId]);

  const { displayName } = useCurrentUser();

  const { messages, isPending, hasOlder, isLoadingOlder, loadOlderMessages } =
    useChatHistory(roomId);
  const { send, retry, discard } = useChatSend({
    roomId,
    sender: { identity: currentUserId, name: displayName }
  });
  const { edit, remove } = useChatSync(roomId);

  const listRef = useAutoScroll<HTMLDivElement>();

  const { sentinelRef } = useChatOlderLoader({
    listRef,
    hasOlder,
    isLoadingOlder,
    isReady: !isPending,
    loadOlder: loadOlderMessages
  });

  const files = useChatFiles({
    roomId,
    disabled: !enabled,
    onSend: (body) => send(body)
  });

  return {
    files,
    hasOlder,
    isEmpty: isEmpty(messages),
    isLoadingOlder,
    isPending,
    lines: groupChatLines({ lines: messages, ownIdentity: currentUserId }),
    listRef,
    sentinelRef,
    actions: { send, retry, discard, edit, remove }
  };
};
