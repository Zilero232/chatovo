import { beforeEach, describe, expect, it, vi } from 'vitest';

const assertCanAccessRoom = vi.fn();
const assertCanModerateRoom = vi.fn();
const emitChatEvent = vi.fn();
const findMessage = vi.fn();
const findMessages = vi.fn();
const createMessage = vi.fn();
const updateMessage = vi.fn();
const findUser = vi.fn();

vi.mock('../../../../../lib', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  assertCanAccessRoom: (input: unknown) => assertCanAccessRoom(input),
  assertCanModerateRoom: (input: unknown) => assertCanModerateRoom(input),
  assertDmWithoutUserBlock: async () => {}
}));

vi.mock('../../../emit-chat-event', () => ({
  emitChatEvent: (roomId: string, event: unknown) => emitChatEvent(roomId, event)
}));

vi.mock('../../../mappers', () => ({
  toChatMessage: ({ id, roomId }: { id: string; roomId: string }) => ({
    id,
    roomId,
    deletedAt: '2026-10-21T10:00:00.000Z'
  })
}));

const { AppForbiddenException } = await import('../../../../../common/exceptions');
const { ChatMessageService } = await import('../chat-message.service');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const AUTHOR = 'author-1';
const OWNER = 'owner-1';
const ROOM_ID = '5f0c3a9e-8f1e-4e2a-9d3b-2c6f7a1b0e4d';
const MESSAGE_ID = '0b7d2c4e-1a3f-4c5b-8e6d-9f0a1b2c3d4e';

const MESSAGE = { id: MESSAGE_ID, senderId: AUTHOR, roomId: ROOM_ID, deletedAt: null };

const prisma = {
  message: {
    findUnique: (...args: unknown[]) => findMessage(...args),
    findMany: (...args: unknown[]) => findMessages(...args),
    create: (...args: unknown[]) => createMessage(...args),
    update: (...args: unknown[]) => updateMessage(...args)
  },
  user: {
    findUnique: (...args: unknown[]) => findUser(...args)
  }
};

const rolesById =
  (roles: Record<string, string>) =>
  ({ where }: { where: { id: string } }) =>
    Promise.resolve({ role: roles[where.id] ?? 'user' });

const banned = () => new AppForbiddenException('ROOM_BANNED', 'Banned from this room');

const service = () => new ChatMessageService(prisma as never);

describe('ChatMessageService.deleteMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findMessage.mockResolvedValue(MESSAGE);
    updateMessage.mockResolvedValue(MESSAGE);
    assertCanAccessRoom.mockResolvedValue(undefined);
    assertCanModerateRoom.mockResolvedValue({ id: ROOM_ID });
    findUser.mockImplementation(rolesById({}));
  });

  it('lets the author delete their own message without being a moderator', async () => {
    await service().deleteMessage({ messageId: MESSAGE_ID, userId: AUTHOR });

    expect(assertCanModerateRoom).not.toHaveBeenCalled();
    expect(updateMessage).toHaveBeenCalled();
  });

  it('lets the room owner delete somebody else’s message', async () => {
    await service().deleteMessage({ messageId: MESSAGE_ID, userId: OWNER });

    expect(assertCanModerateRoom).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: OWNER });
    expect(updateMessage).toHaveBeenCalled();
  });

  it('refuses anyone else and leaves the message in place', async () => {
    assertCanModerateRoom.mockRejectedValueOnce(
      new AppForbiddenException('FORBIDDEN', 'Forbidden')
    );

    expect(
      await codeOf(service().deleteMessage({ messageId: MESSAGE_ID, userId: 'guest-1' }))
    ).toBe('FORBIDDEN');
    expect(updateMessage).not.toHaveBeenCalled();
    expect(emitChatEvent).not.toHaveBeenCalled();
  });

  it('refuses a room owner who is not an admin deleting an app admin’s message', async () => {
    findUser.mockImplementation(rolesById({ [AUTHOR]: 'admin' }));

    expect(await codeOf(service().deleteMessage({ messageId: MESSAGE_ID, userId: OWNER }))).toBe(
      'ROOM_MODERATION_TARGET_PROTECTED'
    );
    expect(updateMessage).not.toHaveBeenCalled();
    expect(emitChatEvent).not.toHaveBeenCalled();
  });

  it('lets an app admin delete another admin’s message', async () => {
    findUser.mockImplementation(rolesById({ [AUTHOR]: 'admin', 'admin-2': 'admin' }));

    await service().deleteMessage({ messageId: MESSAGE_ID, userId: 'admin-2' });

    expect(updateMessage).toHaveBeenCalled();
  });

  it('lets a room owner delete the message of an account that no longer exists', async () => {
    findMessage.mockResolvedValueOnce({ ...MESSAGE, senderId: null });

    await service().deleteMessage({ messageId: MESSAGE_ID, userId: OWNER });

    expect(updateMessage).toHaveBeenCalled();
  });

  it('refuses a banned author deleting their own message in that room', async () => {
    assertCanAccessRoom.mockRejectedValueOnce(banned());

    expect(await codeOf(service().deleteMessage({ messageId: MESSAGE_ID, userId: AUTHOR }))).toBe(
      'ROOM_BANNED'
    );
    expect(updateMessage).not.toHaveBeenCalled();
  });

  it('reports an already deleted message as not found, even to a moderator', async () => {
    findMessage.mockResolvedValueOnce({ ...MESSAGE, deletedAt: new Date() });

    expect(await codeOf(service().deleteMessage({ messageId: MESSAGE_ID, userId: OWNER }))).toBe(
      'MESSAGE_NOT_FOUND'
    );
  });
});

describe('ChatMessageService.sendMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    assertCanAccessRoom.mockResolvedValue(undefined);
  });

  it('refuses a user banned from the room before writing anything', async () => {
    assertCanAccessRoom.mockRejectedValueOnce(banned());

    expect(
      await codeOf(
        service().sendMessage({
          input: { id: 'client-1', roomId: ROOM_ID, body: 'hi' },
          senderId: AUTHOR
        })
      )
    ).toBe('ROOM_BANNED');
    expect(createMessage).not.toHaveBeenCalled();
  });
});

describe('ChatMessageService.listMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findMessages.mockResolvedValue([]);
  });

  it('withholds the room history from a user banned from it', async () => {
    assertCanAccessRoom.mockRejectedValueOnce(banned());

    expect(
      await codeOf(
        service().listMessages({ query: { roomId: ROOM_ID, limit: 50 }, userId: AUTHOR })
      )
    ).toBe('ROOM_BANNED');
    expect(findMessages).not.toHaveBeenCalled();
  });
});

describe('ChatMessageService.editMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findMessage.mockResolvedValue(MESSAGE);
  });

  it('refuses a banned author editing their own message in that room', async () => {
    assertCanAccessRoom.mockRejectedValueOnce(banned());

    expect(
      await codeOf(
        service().editMessage({ messageId: MESSAGE_ID, input: { body: 'edit' }, senderId: AUTHOR })
      )
    ).toBe('ROOM_BANNED');
    expect(updateMessage).not.toHaveBeenCalled();
  });
});
