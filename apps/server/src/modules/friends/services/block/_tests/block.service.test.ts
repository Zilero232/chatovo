import { beforeEach, describe, expect, it, vi } from 'vitest';

const getUserWithProfileOrThrow = vi.fn();
const bumpFriendsEpoch = vi.fn();
const clearCallsBetween = vi.fn();
const upsertBlock = vi.fn();
const deleteBlocks = vi.fn();
const deleteFriendships = vi.fn();
const findRoom = vi.fn();
const removeRoomParticipant = vi.fn();

vi.mock('../../../../../lib', () => ({
  getUserWithProfileOrThrow: (userId: string) => getUserWithProfileOrThrow(userId)
}));

vi.mock('../../../../livekit', () => ({
  removeRoomParticipant: (input: unknown) => removeRoomParticipant(input)
}));

vi.mock('../../../call-store', () => ({
  bumpFriendsEpoch: (...userIds: string[]) => bumpFriendsEpoch(...userIds),
  clearCallsBetween: (input: unknown) => clearCallsBetween(input)
}));

vi.mock('../../../mappers', () => ({
  userBlockInclude: {},
  toUserBlockEntry: ({ blocked, createdAt }: { blocked: { id: string }; createdAt: Date }) => ({
    user: { id: blocked.id },
    blockedAt: createdAt.toISOString()
  })
}));

const { BlockService } = await import('../block.service');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const ME = 'user-me';
const THEM = 'user-them';
const BLOCKED_AT = new Date('2026-10-21T10:00:00.000Z');

const prisma = {
  $transaction: (operations: Promise<unknown>[]) => Promise.all(operations),
  userBlock: {
    upsert: (...args: unknown[]) => upsertBlock(...args),
    deleteMany: (...args: unknown[]) => deleteBlocks(...args)
  },
  friendship: {
    deleteMany: (...args: unknown[]) => deleteFriendships(...args)
  },
  room: {
    findFirst: (...args: unknown[]) => findRoom(...args)
  }
};

const service = () => new BlockService(prisma as never);

describe('BlockService.blockUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUserWithProfileOrThrow.mockResolvedValue({ id: THEM });
    upsertBlock.mockResolvedValue({ blockerId: ME, blockedId: THEM, createdAt: BLOCKED_AT });
    deleteFriendships.mockResolvedValue({ count: 0 });
    findRoom.mockResolvedValue(null);
    removeRoomParticipant.mockResolvedValue(undefined);
  });

  it('refuses to block yourself and writes nothing', async () => {
    expect(await codeOf(service().blockUser({ userId: ME, otherUserId: ME }))).toBe('BLOCK_SELF');
    expect(upsertBlock).not.toHaveBeenCalled();
  });

  it('removes a friendship or pending request in either direction', async () => {
    await service().blockUser({ userId: ME, otherUserId: THEM });

    expect(deleteFriendships).toHaveBeenCalledWith({
      where: {
        OR: [
          { requesterId: ME, addresseeId: THEM },
          { requesterId: THEM, addresseeId: ME }
        ]
      }
    });
  });

  it('refreshes both friend lists when a friendship was removed', async () => {
    deleteFriendships.mockResolvedValueOnce({ count: 1 });

    await service().blockUser({ userId: ME, otherUserId: THEM });

    expect(bumpFriendsEpoch).toHaveBeenCalledWith(ME, THEM);
  });

  it('refreshes only the blocker when nothing linked them, so the blocked user is not signalled', async () => {
    await service().blockUser({ userId: ME, otherUserId: THEM });

    expect(bumpFriendsEpoch).toHaveBeenCalledWith(ME);
  });

  it('drops a call still ringing between the two', async () => {
    await service().blockUser({ userId: ME, otherUserId: THEM });

    expect(clearCallsBetween).toHaveBeenCalledWith({ userId: ME, otherUserId: THEM });
  });

  it('ends a dm call already in progress by dropping both sides from its voice room', async () => {
    findRoom.mockResolvedValueOnce({ id: 'dm-room-1' });

    await service().blockUser({ userId: ME, otherUserId: THEM });

    expect(findRoom).toHaveBeenCalledWith({
      where: {
        kind: 'dm',
        OR: [
          { dmUserAId: ME, dmUserBId: THEM },
          { dmUserAId: THEM, dmUserBId: ME }
        ]
      },
      select: { id: true }
    });
    expect(removeRoomParticipant.mock.calls).toEqual([
      [{ roomId: 'dm-room-1', identity: ME }],
      [{ roomId: 'dm-room-1', identity: THEM }]
    ]);
  });

  it('skips the voice teardown when the two never had a dm', async () => {
    await service().blockUser({ userId: ME, otherUserId: THEM });

    expect(removeRoomParticipant).not.toHaveBeenCalled();
  });

  it('still completes the block when the voice server cannot be reached', async () => {
    findRoom.mockResolvedValueOnce({ id: 'dm-room-1' });
    removeRoomParticipant.mockRejectedValue(new Error('livekit down'));

    await expect(service().blockUser({ userId: ME, otherUserId: THEM })).resolves.toEqual({
      user: { id: THEM },
      blockedAt: BLOCKED_AT.toISOString()
    });
  });

  it('returns the blocked user with the time of the block', async () => {
    const entry = await service().blockUser({ userId: ME, otherUserId: THEM });

    expect(entry).toEqual({ user: { id: THEM }, blockedAt: BLOCKED_AT.toISOString() });
  });
});

describe('BlockService.unblockUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteBlocks.mockResolvedValue({ count: 1 });
  });

  it('lifts only the block the caller placed, never one placed on them', async () => {
    await service().unblockUser({ userId: ME, otherUserId: THEM });

    expect(deleteBlocks).toHaveBeenCalledWith({ where: { blockerId: ME, blockedId: THEM } });
  });

  it('refreshes the blocker’s sessions once a block is lifted', async () => {
    await service().unblockUser({ userId: ME, otherUserId: THEM });

    expect(bumpFriendsEpoch).toHaveBeenCalledWith(ME);
  });

  it('stays silent when there was no block to lift', async () => {
    deleteBlocks.mockResolvedValueOnce({ count: 0 });

    await service().unblockUser({ userId: ME, otherUserId: THEM });

    expect(bumpFriendsEpoch).not.toHaveBeenCalled();
  });
});
