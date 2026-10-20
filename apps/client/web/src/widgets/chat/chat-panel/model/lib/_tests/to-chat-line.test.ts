import type { ChatMessage } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import { chatMessageToChatLine } from '../to-chat-line';

const messageOf = (over: Partial<ChatMessage> = {}): ChatMessage =>
  ({
    id: 'm-1',
    createdAt: '2026-09-03T12:00:00.000Z',
    body: 'hello',
    senderId: 'user-1',
    senderName: 'Ann',
    editedAt: null,
    deletedAt: null,
    ...over
  }) as ChatMessage;

describe('chatMessageToChatLine', () => {
  it('turns the ISO timestamp into milliseconds the list can sort on', () => {
    expect(chatMessageToChatLine(messageOf()).timestamp).toBe(
      new Date('2026-09-03T12:00:00.000Z').getTime()
    );
  });

  it('keeps editedAt and deletedAt null instead of turning them into epoch zero', () => {
    const line = chatMessageToChatLine(messageOf());

    expect(line.editedAt).toBeNull();
    expect(line.deletedAt).toBeNull();
  });

  it('converts edit and delete stamps when the server sent them', () => {
    const line = chatMessageToChatLine(
      messageOf({ editedAt: '2026-09-03T12:05:00.000Z', deletedAt: '2026-09-03T12:06:00.000Z' })
    );

    expect(line.editedAt).toBe(new Date('2026-09-03T12:05:00.000Z').getTime());
    expect(line.deletedAt).toBe(new Date('2026-09-03T12:06:00.000Z').getTime());
  });

  it('falls back to a deleted-author identity so the bubble still renders', () => {
    expect(chatMessageToChatLine(messageOf({ senderId: null })).from?.identity).toBe('deleted');
  });
});
