import type { ChatMessage } from '@chatovo/schemas';

import type { ChatLine } from '../types';

export const chatMessageToChatLine = ({
  id,
  createdAt,
  body,
  senderId,
  senderName,
  senderRole,
  kind,
  call,
  editedAt,
  deletedAt
}: ChatMessage): ChatLine => ({
  id,
  timestamp: new Date(createdAt).getTime(),
  message: body,
  call: kind === 'call' ? call : null,
  editedAt: editedAt ? new Date(editedAt).getTime() : null,
  deletedAt: deletedAt ? new Date(deletedAt).getTime() : null,
  from: {
    identity: senderId ?? 'deleted',
    name: senderName,
    role: senderRole
  }
});
