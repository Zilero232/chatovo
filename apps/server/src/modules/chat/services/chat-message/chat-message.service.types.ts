import type { EditMessageInput, ListMessagesQuery, SendMessageInput } from '@chatovo/schemas';

export type SendChatMessageInput = {
  input: SendMessageInput;
  senderId: string;
};

export type ListChatMessagesInput = {
  query: ListMessagesQuery;
  userId: string;
};

export type GetOwnMessageInput = {
  messageId: string;
  senderId: string;
};

export type EditChatMessageInput = {
  messageId: string;
  input: EditMessageInput;
  senderId: string;
};

export type AssertCanDeleteMessageInput = {
  messageId: string;
  userId: string;
};

export type AssertSenderNotProtectedInput = {
  senderId: string | null;
  userId: string;
};

export type DeleteChatMessageInput = {
  messageId: string;
  userId: string;
};
