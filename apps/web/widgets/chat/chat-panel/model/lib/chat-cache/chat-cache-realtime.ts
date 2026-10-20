import type { RealtimeServerMessage } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';

import { match } from 'ts-pattern';

import { appEvents } from '@/shared/lib';

import {
  appendChatDto,
  deleteChatMessageInCache,
  editChatMessageInCache
} from './chat-cache-write';

export const applyChatRealtime = (
  queryClient: QueryClient,
  message: RealtimeServerMessage
): void => {
  match(message)
    .with({ type: 'chat.message' }, ({ roomId, roomKind, message: dto }) => {
      appendChatDto(queryClient, roomId, dto);
      appEvents.emit.chatMessage({ roomId, senderId: dto.senderId, roomKind });
    })
    .with({ type: 'chat.edit' }, ({ roomId, id, body, editedAt }) => {
      editChatMessageInCache(queryClient, roomId, id, body, new Date(editedAt).getTime());
    })
    .with({ type: 'chat.delete' }, ({ roomId, id, deletedAt }) => {
      deleteChatMessageInCache(queryClient, roomId, id, new Date(deletedAt).getTime());
    })
    .otherwise(() => {});
};
