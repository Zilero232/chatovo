import { beforeEach, describe, expect, it, vi } from 'vitest';

const findRoom = vi.fn();
const findUser = vi.fn();
const assertNotBlocked = vi.fn();
const assertNotRoomBanned = vi.fn();
const assertRoomAccess = vi.fn();
const hasRoomGrant = vi.fn();
const grantRoomAccess = vi.fn();

vi.mock('../../../../../lib', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  assertNotBlocked: (userId: string) => assertNotBlocked(userId),
  assertNotRoomBanned: (input: unknown) => assertNotRoomBanned(input),
  assertDmWithoutUserBlock: async () => {},
  assertDmFriends: async () => {}
}));

vi.mock('../../../lib', () => ({
  assertRoomAccess: (input: unknown) => assertRoomAccess(input),
  resolveInvisible: ({
    requested,
    canBeInvisible
  }: {
    requested?: boolean;
    canBeInvisible: boolean;
  }) => Boolean(requested) && canBeInvisible
}));

vi.mock('../../../room-grant-store', () => ({
  grantRoomAccess: (input: unknown) => grantRoomAccess(input)
}));

vi.mock('../../../../livekit', () => ({
  hasRoomGrant: (roomId: string, userId: string) => hasRoomGrant(roomId, userId)
}));

vi.mock('../../../../users', () => ({
  toUserProfile: () => ({
    name: 'Tester',
    verified: false,
    developer: false,
    profileUrl: null,
    avatarUrl: null,
    bannerColor: null
  })
}));

const { AppForbiddenException } = await import('../../../../../common/exceptions');
const { lockMic, unlockMic } = await import('../../../mic-lock-store');
const { LivekitService } = await import('../livekit.service');

const videoGrantOf = (token: string): Record<string, unknown> => {
  const [, payload = ''] = token.split('.');

  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).video;
};

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const userId = 'user-1';

const prisma = {
  user: { findUnique: (...args: unknown[]) => findUser(...args) },
  room: { findUnique: (...args: unknown[]) => findRoom(...args) }
};

const config = { get: (key: string) => (key === 'LIVEKIT_API_KEY' ? 'devkey' : 'x'.repeat(32)) };

const serviceUnderTest = () => new LivekitService(prisma as never, config as never);

const room = (overrides: Record<string, unknown>) => ({
  id: 'room-1',
  kind: 'group',
  isPrivate: false,
  password: null,
  ownerId: 'owner-1',
  dmUserAId: null,
  dmUserBId: null,
  ...overrides
});

describe('LivekitService.issueRoomToken', () => {
  beforeEach(() => {
    findRoom.mockReset();
    findUser.mockReset().mockResolvedValue({ id: userId, role: 'user', profile: null });
    assertNotBlocked.mockReset().mockResolvedValue(undefined);
    assertNotRoomBanned.mockReset().mockResolvedValue(undefined);
    assertRoomAccess.mockReset().mockResolvedValue(undefined);
    hasRoomGrant.mockReset().mockReturnValue(false);
    grantRoomAccess.mockReset();
  });

  it('issues a token for a public room and records the grant', async () => {
    findRoom.mockResolvedValueOnce(room({}));

    const result = await serviceUnderTest().issueRoomToken({
      roomId: 'room-1',
      userId
    });

    expect(result.token).toEqual(expect.any(String));
    expect(grantRoomAccess).toHaveBeenCalledWith({ roomId: 'room-1', userId, isHidden: false });
  });

  it('refuses a dm the user is not part of', async () => {
    findRoom.mockResolvedValueOnce(room({ kind: 'dm', dmUserAId: 'a', dmUserBId: 'b' }));

    await expect(
      codeOf(serviceUnderTest().issueRoomToken({ roomId: 'room-1', userId }))
    ).resolves.toBe('FORBIDDEN');
    expect(grantRoomAccess).not.toHaveBeenCalled();
  });

  it('lets a dm member in', async () => {
    findRoom.mockResolvedValueOnce(room({ kind: 'dm', dmUserAId: userId, dmUserBId: 'b' }));

    await expect(serviceUnderTest().issueRoomToken({ roomId: 'room-1', userId })).resolves.toEqual({
      token: expect.any(String)
    });
  });

  it('lets a stranger reach the password check of a private room', async () => {
    findRoom.mockResolvedValueOnce(room({ isPrivate: true, password: 'hashed' }));

    await serviceUnderTest().issueRoomToken({
      roomId: 'room-1',
      userId,
      password: 'secret'
    });

    expect(assertRoomAccess).toHaveBeenCalledWith({
      room: expect.objectContaining({ isPrivate: true }),
      userId,
      password: 'secret'
    });
  });

  it('reports a missing room as not found', async () => {
    findRoom.mockResolvedValueOnce(null);

    await expect(
      codeOf(serviceUnderTest().issueRoomToken({ roomId: 'gone', userId }))
    ).resolves.toBe('ROOM_NOT_FOUND');
  });

  it('skips the password check for an invisible admin', async () => {
    findUser.mockResolvedValueOnce({ id: userId, role: 'admin', profile: null });
    findRoom.mockResolvedValueOnce(room({ isPrivate: true, password: 'hashed' }));

    await serviceUnderTest().issueRoomToken({
      roomId: 'room-1',
      userId,
      invisible: true
    });

    expect(assertRoomAccess).not.toHaveBeenCalled();
  });

  it('refuses a user the room owner banned, before the password check and without a grant', async () => {
    findRoom.mockResolvedValueOnce(room({ isPrivate: true, password: 'hashed' }));
    assertNotRoomBanned.mockRejectedValueOnce(
      new AppForbiddenException('ROOM_BANNED', 'Banned from this room')
    );

    await expect(
      codeOf(
        serviceUnderTest().issueRoomToken({
          roomId: 'room-1',
          userId,
          password: 'secret'
        })
      )
    ).resolves.toBe('ROOM_BANNED');
    expect(assertRoomAccess).not.toHaveBeenCalled();
    expect(grantRoomAccess).not.toHaveBeenCalled();
  });

  it('never applies a room ban to an app admin', async () => {
    findUser.mockResolvedValueOnce({ id: userId, role: 'admin', profile: null });
    findRoom.mockResolvedValueOnce(room({}));

    await serviceUnderTest().issueRoomToken({ roomId: 'room-1', userId });

    expect(assertNotRoomBanned).not.toHaveBeenCalled();
  });

  it('keeps the microphone off the publish grant while the owner’s mic lock is set', async () => {
    findRoom.mockResolvedValueOnce(room({}));
    lockMic({ roomId: 'room-1', userId });

    const { token } = await serviceUnderTest().issueRoomToken({
      roomId: 'room-1',
      userId
    });

    unlockMic({ roomId: 'room-1', userId });

    expect(videoGrantOf(token)).toMatchObject({
      canPublish: true,
      canPublishSources: ['camera', 'screen_share', 'screen_share_audio']
    });
  });

  it('leaves the publish sources unrestricted without a mic lock', async () => {
    findRoom.mockResolvedValueOnce(room({}));

    const { token } = await serviceUnderTest().issueRoomToken({
      roomId: 'room-1',
      userId
    });

    expect(videoGrantOf(token)).not.toHaveProperty('canPublishSources');
  });

  it('applies a mic lock only to the room it was set in', async () => {
    findRoom.mockResolvedValueOnce(room({}));
    lockMic({ roomId: 'room-2', userId });

    const { token } = await serviceUnderTest().issueRoomToken({
      roomId: 'room-1',
      userId
    });

    unlockMic({ roomId: 'room-2', userId });

    expect(videoGrantOf(token)).not.toHaveProperty('canPublishSources');
  });

  it('refuses a blocked account before any lookup', async () => {
    assertNotBlocked.mockRejectedValueOnce(new Error('blocked'));

    await expect(serviceUnderTest().issueRoomToken({ roomId: 'room-1', userId })).rejects.toThrow(
      'blocked'
    );
    expect(findRoom).not.toHaveBeenCalled();
  });
});
