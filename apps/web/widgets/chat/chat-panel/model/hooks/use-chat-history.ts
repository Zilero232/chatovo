'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

import { fetchChatMessages } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import type { ChatHistoryPage } from '../types';

import { chatMessageToChatLine, mergeChatHistory, prependChatHistory } from '../lib';

const CHAT_PAGE_SIZE = 30;

export const useChatHistory = (roomId: string) => {
  const queryClient = useQueryClient();

  const { data, isPending, isFetching } = useQuery<ChatHistoryPage>({
    queryKey: QUERY_KEYS.chatMessages(roomId),
    enabled: roomId.length > 0,
    staleTime: secondsToMilliseconds(30),
    queryFn: async () => {
      const page = await fetchChatMessages(roomId, undefined, CHAT_PAGE_SIZE);
      const fetched = page.items.map(chatMessageToChatLine);

      return mergeChatHistory(queryClient, roomId, fetched, page.nextCursor);
    }
  });

  const loadOlder = useMutation({
    mutationFn: (cursor: string) => fetchChatMessages(roomId, cursor, CHAT_PAGE_SIZE),
    onSuccess: (page) => {
      prependChatHistory(
        queryClient,
        roomId,
        page.items.map(chatMessageToChatLine),
        page.nextCursor
      );
    }
  });

  const messages = data?.lines ?? [];
  const cursor = data?.nextCursor ?? null;
  const isLoading = isPending && isFetching && messages.length === 0;

  const loadOlderMessages = () => {
    if (cursor && !loadOlder.isPending) {
      loadOlder.mutate(cursor);
    }
  };

  return {
    messages,
    isPending: isLoading,
    hasOlder: Boolean(cursor),
    isLoadingOlder: loadOlder.isPending,
    loadOlderMessages
  };
};
