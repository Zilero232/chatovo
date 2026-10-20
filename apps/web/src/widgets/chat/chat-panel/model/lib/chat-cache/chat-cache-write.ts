import type { ChatMessage } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';

import type { ChatLine, ChatLineStatus } from '../../types';

import {
  appendChatLine,
  applyChatDeleteToLines,
  applyChatEditToLines,
  applyChatStatusToLines,
  removeChatLine
} from '../merge-chat-lines';
import { chatMessageToChatLine } from '../to-chat-line';
import { patchChatLines } from './chat-cache-keys';

export const appendChatMessage = (
  queryClient: QueryClient,
  roomId: string,
  line: ChatLine
): void => {
  patchChatLines(queryClient, roomId, (lines) => appendChatLine(lines, line));
};

export const appendChatDto = (
  queryClient: QueryClient,
  roomId: string,
  message: ChatMessage
): void => {
  appendChatMessage(queryClient, roomId, { ...chatMessageToChatLine(message), status: undefined });
};

export const markChatLineStatus = (
  queryClient: QueryClient,
  roomId: string,
  id: string,
  status: ChatLineStatus
): void => {
  patchChatLines(queryClient, roomId, (lines) =>
    lines ? applyChatStatusToLines(lines, id, status) : lines
  );
};

export const dropChatLine = (queryClient: QueryClient, roomId: string, id: string): void => {
  patchChatLines(queryClient, roomId, (lines) => (lines ? removeChatLine(lines, id) : lines));
};

export const editChatMessageInCache = (
  queryClient: QueryClient,
  roomId: string,
  id: string,
  body: string,
  editedAt: number
): void => {
  patchChatLines(queryClient, roomId, (lines) =>
    lines ? applyChatEditToLines(lines, id, body, editedAt) : lines
  );
};

export const deleteChatMessageInCache = (
  queryClient: QueryClient,
  roomId: string,
  id: string,
  deletedAt: number
): void => {
  patchChatLines(queryClient, roomId, (lines) =>
    lines ? applyChatDeleteToLines(lines, id, deletedAt) : lines
  );
};
