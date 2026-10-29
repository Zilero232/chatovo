import type { FriendUser } from '@chatovo/schemas';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CallEndedEvent } from '../../../../../common/events/domain-events';

const createMessage = vi.fn();
const emitChatEvent = vi.fn();

vi.mock('../../../emit-chat-event', () => ({
  emitChatEvent: (roomId: string, event: unknown) => emitChatEvent(roomId, event)
}));

vi.mock('../../../mappers', () => ({
  toChatMessage: (row: unknown) => row
}));

const { ChatCallLogService } = await import('../chat-call-log.service');

const userOf = (id: string): FriendUser => ({
  id,
  name: id,
  friendTag: id,
  avatarUrl: null,
  verified: false,
  developer: false,
  isOnline: true
});

const ENDED: CallEndedEvent = {
  callId: '0b7d2c4e-1a3f-4c5b-8e6d-9f0a1b2c3d4e',
  roomId: 'room-1',
  caller: userOf('ann'),
  callee: userOf('bob'),
  outcome: 'completed',
  answeredAt: '2026-10-29T12:00:00.000Z',
  endedAt: '2026-10-29T12:12:34.000Z',
  durationSec: 754
};

const service = () =>
  new ChatCallLogService({
    message: { create: (...args: unknown[]) => createMessage(...args) }
  } as never);

describe('ChatCallLogService.recordCall', () => {
  beforeEach(() => {
    createMessage
      .mockReset()
      .mockImplementation(({ data }: { data: object }) => ({ id: 'm', ...data }));
    emitChatEvent.mockReset().mockResolvedValue(undefined);
  });

  it('writes a call row from the caller with its outcome and length', async () => {
    await service().recordCall(ENDED);

    expect(createMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          roomId: 'room-1',
          senderId: 'ann',
          kind: 'call',
          call: { outcome: 'completed', durationSec: 754, callerId: 'ann' },
          body: 'Call · 12:34'
        }
      })
    );
    expect(emitChatEvent).toHaveBeenCalledWith(
      'room-1',
      expect.objectContaining({ type: 'chat.message' })
    );
  });

  it('leaves no trace of a call cut short by a block', async () => {
    await service().recordCall({ ...ENDED, outcome: 'blocked' });

    expect(createMessage).not.toHaveBeenCalled();
    expect(emitChatEvent).not.toHaveBeenCalled();
  });
});
