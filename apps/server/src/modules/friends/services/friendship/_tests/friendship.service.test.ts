import { beforeEach, describe, expect, it, vi } from 'vitest';

const getUserWithProfileOrThrow = vi.fn();
const bumpFriendsEpoch = vi.fn();
const findUser = vi.fn();
const findBlock = vi.fn();
const findFriendship = vi.fn();
const createFriendship = vi.fn();
const updateFriendships = vi.fn();

vi.mock('../../../../../lib', () => ({
  getUserWithProfileOrThrow: (userId: string) => getUserWithProfileOrThrow(userId)
}));

vi.mock('../../../call-store', () => ({
  bumpFriendsEpoch: (...userIds: string[]) => bumpFriendsEpoch(...userIds)
}));

vi.mock('../../../../realtime', () => ({
  emitUserEvent: vi.fn(),
  hasUserConnection: () => false
}));

const { FriendshipService } = await import('../friendship.service');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const failureOf = async (call: Promise<unknown>) => {
  try {
    await call;
  } catch (error) {
    const failure = error as { getStatus: () => number; getResponse: () => unknown };

    return { status: failure.getStatus(), response: failure.getResponse() };
  }

  throw new Error('expected the call to throw');
};

const ME = 'user-me';
const THEM = 'user-them';

const prisma = {
  user: { findUnique: (...args: unknown[]) => findUser(...args) },
  userBlock: { findUnique: (...args: unknown[]) => findBlock(...args) },
  friendship: {
    findFirst: (...args: unknown[]) => findFriendship(...args),
    create: (...args: unknown[]) => createFriendship(...args),
    updateMany: (...args: unknown[]) => updateFriendships(...args)
  }
};

const service = () => new FriendshipService(prisma as never);

const blockPlacedBy =
  (blockerId: string) =>
  ({ where }: { where: { blockerId_blockedId: { blockerId: string } } }) =>
    Promise.resolve(where.blockerId_blockedId.blockerId === blockerId ? { blockerId } : null);

describe('FriendshipService across a block', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findUser.mockResolvedValue({ id: THEM });
    getUserWithProfileOrThrow.mockResolvedValue({ id: THEM });
    findFriendship.mockResolvedValue(null);
    findBlock.mockResolvedValue(null);
  });

  it('tells you a request is blocked when you blocked that user yourself', async () => {
    findBlock.mockImplementation(blockPlacedBy(ME));

    expect(await codeOf(service().sendFriendRequest({ requesterId: ME, tag: 'them#0001' }))).toBe(
      'FRIEND_REQUEST_BLOCKED'
    );
    expect(createFriendship).not.toHaveBeenCalled();
  });

  it('answers a request to someone who blocked you exactly like an unknown tag', async () => {
    findBlock.mockImplementation(blockPlacedBy(THEM));

    const blocked = await failureOf(
      service().sendFriendRequest({ requesterId: ME, tag: 'them#0001' })
    );

    findUser.mockResolvedValueOnce(null);

    const unknown = await failureOf(
      service().sendFriendRequest({ requesterId: ME, tag: 'nobody#0001' })
    );

    expect(blocked).toEqual(unknown);
    expect(blocked).toMatchObject({ status: 404, response: { code: 'USER_NOT_FOUND' } });
    expect(createFriendship).not.toHaveBeenCalled();
  });

  it('refuses to accept a request from someone you blocked, saying so', async () => {
    findFriendship.mockResolvedValueOnce({ requesterId: THEM });
    findBlock.mockImplementation(blockPlacedBy(ME));

    expect(await codeOf(service().acceptFriendRequest({ userId: ME, friendshipId: 'f-1' }))).toBe(
      'FRIEND_REQUEST_BLOCKED'
    );
    expect(updateFriendships).not.toHaveBeenCalled();
  });

  it('answers accepting a request from someone who blocked you exactly like a missing request', async () => {
    findFriendship.mockResolvedValueOnce({ requesterId: THEM });
    findBlock.mockImplementation(blockPlacedBy(THEM));

    const blocked = await failureOf(
      service().acceptFriendRequest({ userId: ME, friendshipId: 'f-1' })
    );

    findFriendship.mockResolvedValueOnce(null);

    const missing = await failureOf(
      service().acceptFriendRequest({ userId: ME, friendshipId: 'f-2' })
    );

    expect(blocked).toEqual(missing);
    expect(blocked).toMatchObject({ status: 404, response: { code: 'FRIEND_REQUEST_NOT_FOUND' } });
    expect(updateFriendships).not.toHaveBeenCalled();
  });

  it('reports a user you blocked as blocked', async () => {
    findBlock.mockImplementation(blockPlacedBy(ME));

    expect(await service().getFriendshipRelation({ userId: ME, otherUserId: THEM })).toEqual({
      status: 'blocked'
    });
  });

  it('shows someone who blocked you as a plain stranger, so the block stays hidden', async () => {
    findBlock.mockImplementation(blockPlacedBy(THEM));

    expect(await service().getFriendshipRelation({ userId: ME, otherUserId: THEM })).toEqual({
      status: 'none'
    });
  });
});
