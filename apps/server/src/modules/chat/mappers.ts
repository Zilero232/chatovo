import type { ChatMessage } from '@chatovo/schemas';

import { toUserRole } from '@chatovo/schemas';

import type { Prisma } from '../../../generated';
import type { senderSelect } from '../../lib';

import { resolveDisplayName } from '../users';

export type MessageWithSender = Prisma.MessageGetPayload<{
  include: { sender: typeof senderSelect };
}>;

export const toChatMessage = (row: MessageWithSender): ChatMessage => {
  const { id, roomId, senderId, sender, body, createdAt, editedAt, deletedAt } = row;

  return {
    id,
    roomId,
    senderId,
    senderName:
      sender && senderId
        ? resolveDisplayName({
            displayName: sender.profile?.displayName,
            name: sender.name,
            userId: senderId
          })
        : 'Deleted user',
    senderRole: toUserRole(sender?.role),
    body: deletedAt ? '' : body,
    createdAt: createdAt.toISOString(),
    editedAt: editedAt?.toISOString() ?? null,
    deletedAt: deletedAt?.toISOString() ?? null
  };
};
