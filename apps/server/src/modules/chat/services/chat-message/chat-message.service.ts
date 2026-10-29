import type { ChatMessage, ChatMessagesPage } from '@chatovo/schemas';

import { canActOnRole } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { isNonNullish, isNullish } from 'remeda';

import type {
  AssertCanDeleteMessageInput,
  AssertSenderNotProtectedInput,
  DeleteChatMessageInput,
  EditChatMessageInput,
  GetOwnMessageInput,
  ListChatMessagesInput,
  SendChatMessageInput
} from './chat-message.service.types';

import { AppForbiddenException, AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import {
  assertCanAccessRoom,
  assertCanModerateRoom,
  assertDmWithoutUserBlock,
  senderSelect
} from '../../../../lib';
import { assertVisibleInRoom } from '../../../livekit';
import { emitChatEvent } from '../../emit-chat-event';
import { toChatMessage } from '../../mappers';

@Injectable()
export class ChatMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage({ input, senderId }: SendChatMessageInput): Promise<ChatMessage> {
    const { id, roomId, body } = input;

    await assertCanAccessRoom({ roomId, userId: senderId });
    await assertDmWithoutUserBlock({ roomId, userId: senderId });

    assertVisibleInRoom({ roomId, identity: senderId });

    const existing = await this.prisma.message.findUnique({
      where: { id },
      include: { sender: senderSelect }
    });

    if (isNonNullish(existing)) {
      if (existing.senderId !== senderId || existing.roomId !== roomId) {
        throw new AppForbiddenException('MESSAGE_NOT_OWNED', 'Message id already used');
      }

      return toChatMessage(existing);
    }

    const message = await this.prisma.message.create({
      data: { id, roomId, senderId, body },
      include: { sender: senderSelect }
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(roomId, { type: 'chat.message', message: chatMessage });

    return chatMessage;
  }

  async listMessages({ query, userId }: ListChatMessagesInput): Promise<ChatMessagesPage> {
    const { roomId, cursor, limit } = query;

    await assertCanAccessRoom({ roomId, userId });

    const rows = await this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: { sender: senderSelect },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const oldest = page.at(-1)?.id ?? null;

    return {
      items: page.slice().reverse().map(toChatMessage),
      nextCursor: hasMore ? oldest : null
    };
  }

  private async getLiveMessageOrThrow(messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, senderId: true, roomId: true, deletedAt: true }
    });

    if (!message || message.deletedAt) {
      throw new AppNotFoundException('MESSAGE_NOT_FOUND', 'Message not found');
    }

    return message;
  }

  private async getOwnMessageOrThrow({ messageId, senderId }: GetOwnMessageInput) {
    const message = await this.getLiveMessageOrThrow(messageId);

    if (message.senderId !== senderId) {
      throw new AppForbiddenException('MESSAGE_NOT_OWNED', 'Not your message');
    }

    await assertCanAccessRoom({ roomId: message.roomId, userId: senderId });

    return message;
  }

  private async assertCanDeleteMessage({
    messageId,
    userId
  }: AssertCanDeleteMessageInput): Promise<void> {
    const { senderId, roomId } = await this.getLiveMessageOrThrow(messageId);

    if (senderId === userId) {
      await assertCanAccessRoom({ roomId, userId });

      return;
    }

    const { role } = await assertCanModerateRoom({ roomId, userId });

    await this.assertSenderNotProtected({ senderId, actorRole: role });
  }

  private async assertSenderNotProtected({
    senderId,
    actorRole
  }: AssertSenderNotProtectedInput): Promise<void> {
    if (isNullish(senderId)) {
      return;
    }

    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { role: true }
    });

    if (!canActOnRole({ actorRole, targetRole: sender?.role })) {
      throw new AppForbiddenException(
        'ROOM_MODERATION_TARGET_PROTECTED',
        'This participant cannot be moderated'
      );
    }
  }

  async editMessage({ messageId, input, senderId }: EditChatMessageInput): Promise<ChatMessage> {
    const { roomId } = await this.getOwnMessageOrThrow({ messageId, senderId });

    assertVisibleInRoom({ roomId, identity: senderId });

    const message = await this.prisma.message.update({
      where: { id: messageId },
      data: { body: input.body, editedAt: new Date() },
      include: { sender: senderSelect }
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(chatMessage.roomId, {
      type: 'chat.edit',
      id: chatMessage.id,
      body: chatMessage.body,
      editedAt: chatMessage.editedAt ?? new Date().toISOString()
    });

    return chatMessage;
  }

  async deleteMessage({ messageId, userId }: DeleteChatMessageInput): Promise<ChatMessage> {
    await this.assertCanDeleteMessage({ messageId, userId });

    const message = await this.prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
      include: { sender: senderSelect }
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(chatMessage.roomId, {
      type: 'chat.delete',
      id: chatMessage.id,
      deletedAt: chatMessage.deletedAt ?? new Date().toISOString()
    });

    return chatMessage;
  }
}
