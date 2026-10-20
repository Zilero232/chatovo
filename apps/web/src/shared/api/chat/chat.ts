import type { ChatAttachment, ChatMessage, ChatMessagesPage } from '@chatovo/schemas';

import { api, UPLOAD_TIMEOUT_MS } from '../http';

export const editChatMessage = async (id: string, body: string): Promise<ChatMessage> => {
  const { data } = await api.patch(`/chat/messages/${id}`, { body });

  return data;
};

export const deleteChatMessage = async (id: string): Promise<ChatMessage> => {
  const { data } = await api.delete(`/chat/messages/${id}`);

  return data;
};

export const uploadChatAttachment = async (roomId: string, file: File): Promise<ChatAttachment> => {
  const fd = new FormData();
  fd.append('roomId', roomId);
  fd.append('file', file);

  const { data } = await api.post('/chat/attachments', fd, { timeout: UPLOAD_TIMEOUT_MS });

  return data;
};

export const sendChatMessage = async (
  id: string,
  roomId: string,
  body: string
): Promise<ChatMessage> => {
  const { data } = await api.post('/chat/messages', { id, roomId, body });

  return data;
};

export const fetchChatMessages = async (
  roomId: string,
  cursor?: string,
  limit = 50
): Promise<ChatMessagesPage> => {
  const { data } = await api.get('/chat/messages', {
    params: { roomId, limit, ...(cursor ? { cursor } : {}) }
  });

  return data;
};
