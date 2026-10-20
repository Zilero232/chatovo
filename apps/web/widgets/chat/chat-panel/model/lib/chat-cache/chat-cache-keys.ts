import type { QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import type { ChatHistoryPage, ChatLine } from '../../types';

const chatKey = (roomId: string) => QUERY_KEYS.chatMessages(roomId);

export const readChatHistory = (
  queryClient: QueryClient,
  roomId: string
): ChatHistoryPage | undefined => queryClient.getQueryData<ChatHistoryPage>(chatKey(roomId));

export const readChatLines = (queryClient: QueryClient, roomId: string): ChatLine[] | undefined =>
  readChatHistory(queryClient, roomId)?.lines;

export const patchChatLines = (
  queryClient: QueryClient,
  roomId: string,
  updater: (lines: ChatLine[] | undefined) => ChatLine[] | undefined
): void => {
  queryClient.setQueryData<ChatHistoryPage>(chatKey(roomId), (page) => {
    const lines = updater(page?.lines);

    if (!lines) {
      return page;
    }

    return { lines, nextCursor: page?.nextCursor ?? null };
  });
};

export const patchChatCursor = (
  queryClient: QueryClient,
  roomId: string,
  nextCursor: string | null
): void => {
  queryClient.setQueryData<ChatHistoryPage>(chatKey(roomId), (page) =>
    page ? { ...page, nextCursor } : page
  );
};
