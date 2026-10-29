import { beforeEach, describe, expect, it, vi } from 'vitest';

const findRoom = vi.fn();
const findUser = vi.fn();

vi.mock('../../../core', () => ({
  basePrisma: {
    room: { findUnique: (...args: unknown[]) => findRoom(...args) },
    user: { findUnique: (...args: unknown[]) => findUser(...args) }
  }
}));

const { assertCanModerateRoom } = await import('../assert-can-moderate-room');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const OWNER = 'owner-1';

const ROOM = { id: 'room-1', name: 'evening', kind: 'group', ownerId: OWNER };

describe('assertCanModerateRoom', () => {
  beforeEach(() => {
    findRoom.mockReset().mockResolvedValue(ROOM);
    findUser.mockReset().mockResolvedValue({ role: 'user' });
  });

  it('hands the owner their room back with their role', async () => {
    await expect(assertCanModerateRoom({ roomId: 'room-1', userId: OWNER })).resolves.toEqual({
      room: ROOM,
      role: 'user'
    });
  });

  it('lets an app admin moderate somebody else’s room', async () => {
    findUser.mockResolvedValueOnce({ role: 'admin' });

    await expect(assertCanModerateRoom({ roomId: 'room-1', userId: 'admin-1' })).resolves.toEqual({
      room: ROOM,
      role: 'admin'
    });
  });

  it('lets a moderator, who has no admin panel, moderate somebody else’s room', async () => {
    findUser.mockResolvedValueOnce({ role: 'moderator' });

    await expect(
      assertCanModerateRoom({ roomId: 'room-1', userId: 'moderator-1' })
    ).resolves.toEqual({ room: ROOM, role: 'moderator' });
  });

  it('refuses a participant who neither owns the room nor is an admin', async () => {
    expect(await codeOf(assertCanModerateRoom({ roomId: 'room-1', userId: 'guest-1' }))).toBe(
      'FORBIDDEN'
    );
  });

  it('refuses an account that no longer exists', async () => {
    findUser.mockResolvedValueOnce(null);

    expect(await codeOf(assertCanModerateRoom({ roomId: 'room-1', userId: 'gone-1' }))).toBe(
      'FORBIDDEN'
    );
  });

  it('refuses to moderate a dm', async () => {
    findRoom.mockResolvedValueOnce({ ...ROOM, kind: 'dm' });

    expect(await codeOf(assertCanModerateRoom({ roomId: 'room-1', userId: OWNER }))).toBe(
      'FORBIDDEN'
    );
  });

  it('reports a missing room as not found', async () => {
    findRoom.mockResolvedValueOnce(null);

    expect(await codeOf(assertCanModerateRoom({ roomId: 'gone', userId: OWNER }))).toBe(
      'ROOM_NOT_FOUND'
    );
  });
});
