import type { QueryClient } from '@tanstack/react-query';

import type { ChatHistoryPage, ChatLine } from '../../types';

import { mergeChatLines, prependChatLines } from '../merge-chat-lines';
import { patchChatCursor, patchChatLines, readChatHistory } from './chat-cache-keys';

export const mergeChatHistory = (
  queryClient: QueryClient,
  roomId: string,
  fetched: ChatLine[],
  fetchedCursor: string | null
): ChatHistoryPage => {
  const cached = readChatHistory(queryClient, roomId);

  if (!cached?.lines.length) {
    return { lines: fetched, nextCursor: fetchedCursor };
  }

  return {
    lines: mergeChatLines(cached.lines, fetched),
    nextCursor: cached.nextCursor ?? fetchedCursor
  };
};

export const prependChatHistory = (
  queryClient: QueryClient,
  roomId: string,
  older: ChatLine[],
  nextCursor: string | null
): void => {
  patchChatLines(queryClient, roomId, (lines) => prependChatLines(lines, older));
  patchChatCursor(queryClient, roomId, nextCursor);
};
