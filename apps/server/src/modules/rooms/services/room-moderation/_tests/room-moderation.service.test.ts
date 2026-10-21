import { beforeEach, describe, expect, it, vi } from 'vitest';

const assertCanModerateRoom = vi.fn();
const removeRoomParticipant = vi.fn();
const setParticipantMicLock = vi.fn();
const findRoomParticipant = vi.fn();
const lockMic = vi.fn();
const unlockMic = vi.fn();
const revokeRoomGrant = vi.fn();
const emitUserEvent = vi.fn();
const unsubscribeUserFromRoom = vi.fn();
const findUser = vi.fn();
const upsertBan = vi.fn();
const deleteBans = vi.fn();

vi.mock('../../../../../lib', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  assertCanModerateRoom: (input: unknown) => assertCanModerateRoom(input)
}));

vi.mock('../../../../livekit', () => ({
  findRoomParticipant: (input: unknown) => findRoomParticipant(input),
  lockMic: (input: unknown) => lockMic(input),
  removeRoomParticipant: (input: unknown) => removeRoomParticipant(input),
  revokeRoomGrant: (input: unknown) => revokeRoomGrant(input),
  setParticipantMicLock: (input: unknown) => setParticipantMicLock(input),
  unlockMic: (input: unknown) => unlockMic(input)
}));

vi.mock('../../../../realtime', () => ({
  emitUserEvent: (userId: string, message: unknown) => emitUserEvent(userId, message),
  unsubscribeUserFromRoom: (input: unknown) => unsubscribeUserFromRoom(input)
}));

const { AppForbiddenException } = await import('../../../../../common/exceptions');
const { RoomModerationService } = await import('../room-moderation.service');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const OWNER = 'owner-1';
const TROLL = 'troll-1';
const ROOM_ID = 'room-1';
const ROOM = { id: ROOM_ID, name: 'evening', kind: 'group', ownerId: OWNER };

const prisma = {
  user: { findUnique: (...args: unknown[]) => findUser(...args) },
  roomBan: {
    upsert: (...args: unknown[]) => upsertBan(...args),
    deleteMany: (...args: unknown[]) => deleteBans(...args)
  }
};

const service = () => new RoomModerationService(prisma as never);

const target = (targetId: string) => ({ roomId: ROOM_ID, userId: OWNER, targetId });

describe('RoomModerationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    assertCanModerateRoom.mockResolvedValue(ROOM);
    findUser.mockResolvedValue({ role: 'user' });
    upsertBan.mockResolvedValue({});
    removeRoomParticipant.mockResolvedValue(undefined);
    setParticipantMicLock.mockResolvedValue(undefined);
    findRoomParticipant.mockReturnValue({ identity: TROLL });
  });

  it('tells the participant they were removed before disconnecting them, so the notice is not lost', async () => {
    await service().removeParticipant(target(TROLL));

    expect(emitUserEvent).toHaveBeenCalledWith(TROLL, {
      type: 'room.moderation',
      roomId: ROOM_ID,
      roomName: ROOM.name,
      action: 'removed'
    });
    expect(removeRoomParticipant).toHaveBeenCalledWith({ roomId: ROOM_ID, identity: TROLL });
    expect(emitUserEvent.mock.invocationCallOrder[0]).toBeLessThan(
      removeRoomParticipant.mock.invocationCallOrder[0] ?? 0
    );
    expect(upsertBan).not.toHaveBeenCalled();
  });

  it('records the ban before disconnecting, so an instant rejoin is already refused', async () => {
    await service().banParticipant(target(TROLL));

    expect(upsertBan).toHaveBeenCalledWith(
      expect.objectContaining({
        create: { roomId: ROOM_ID, userId: TROLL, bannedById: OWNER }
      })
    );
    expect(upsertBan.mock.invocationCallOrder[0]).toBeLessThan(
      removeRoomParticipant.mock.invocationCallOrder[0] ?? 0
    );
    expect(emitUserEvent).toHaveBeenCalledWith(
      TROLL,
      expect.objectContaining({ action: 'banned' })
    );
  });

  it('locks the microphone on mute and lifts the lock on unmute', async () => {
    await service().muteParticipant(target(TROLL));
    await service().unmuteParticipant(target(TROLL));

    expect(setParticipantMicLock.mock.calls).toEqual([
      [{ roomId: ROOM_ID, identity: TROLL, locked: true }],
      [{ roomId: ROOM_ID, identity: TROLL, locked: false }]
    ]);
  });

  it('remembers a mute for the room session so a rejoin is still muted, and forgets it on unmute', async () => {
    await service().muteParticipant(target(TROLL));

    expect(lockMic).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: TROLL });
    expect(lockMic.mock.invocationCallOrder[0]).toBeLessThan(
      setParticipantMicLock.mock.invocationCallOrder[0] ?? 0
    );

    await service().unmuteParticipant(target(TROLL));

    expect(unlockMic).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: TROLL });
  });

  it('forgets a mute when the participant is removed, so they come back with a fresh start', async () => {
    await service().removeParticipant(target(TROLL));

    expect(unlockMic).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: TROLL });
  });

  it('cuts a banned user off the room’s realtime channel and private-room grant', async () => {
    await service().banParticipant(target(TROLL));

    expect(revokeRoomGrant).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: TROLL });
    expect(unsubscribeUserFromRoom).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: TROLL });
    expect(unlockMic).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: TROLL });
  });

  it('bans a user who is not in the room without notifying them', async () => {
    findRoomParticipant.mockReturnValue(null);

    await service().banParticipant(target(TROLL));

    expect(upsertBan).toHaveBeenCalled();
    expect(unsubscribeUserFromRoom).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: TROLL });
    expect(emitUserEvent).not.toHaveBeenCalled();
  });

  it.each(['removeParticipant', 'muteParticipant', 'unmuteParticipant'] as const)(
    '%s refuses a target who is not in the room with 404 and tells nobody',
    async (action) => {
      findRoomParticipant.mockReturnValue(null);

      expect(await codeOf(service()[action](target(TROLL)))).toBe('USER_NOT_FOUND');
      expect(findRoomParticipant).toHaveBeenCalledWith({ roomId: ROOM_ID, identity: TROLL });
      expect(emitUserEvent).not.toHaveBeenCalled();
      expect(removeRoomParticipant).not.toHaveBeenCalled();
      expect(setParticipantMicLock).not.toHaveBeenCalled();
      expect(lockMic).not.toHaveBeenCalled();
      expect(unlockMic).not.toHaveBeenCalled();
    }
  );

  it('refuses a caller who neither owns the room nor is an admin, and touches nothing', async () => {
    assertCanModerateRoom.mockRejectedValueOnce(
      new AppForbiddenException('FORBIDDEN', 'Forbidden')
    );

    expect(await codeOf(service().banParticipant(target(TROLL)))).toBe('FORBIDDEN');
    expect(upsertBan).not.toHaveBeenCalled();
    expect(removeRoomParticipant).not.toHaveBeenCalled();
    expect(emitUserEvent).not.toHaveBeenCalled();
  });

  it('refuses to moderate the room owner', async () => {
    expect(await codeOf(service().removeParticipant(target(OWNER)))).toBe(
      'ROOM_MODERATION_TARGET_PROTECTED'
    );
    expect(removeRoomParticipant).not.toHaveBeenCalled();
  });

  it('refuses to moderate an app admin', async () => {
    findUser.mockResolvedValueOnce({ role: 'admin' });

    expect(await codeOf(service().muteParticipant(target('admin-1')))).toBe(
      'ROOM_MODERATION_TARGET_PROTECTED'
    );
    expect(setParticipantMicLock).not.toHaveBeenCalled();
  });

  it('reports a target account that does not exist', async () => {
    findUser.mockResolvedValueOnce(null);

    expect(await codeOf(service().banParticipant(target('ghost-1')))).toBe('USER_NOT_FOUND');
    expect(upsertBan).not.toHaveBeenCalled();
  });

  it('checks the caller before lifting a ban', async () => {
    assertCanModerateRoom.mockRejectedValueOnce(
      new AppForbiddenException('FORBIDDEN', 'Forbidden')
    );

    expect(await codeOf(service().unbanUser(target(TROLL)))).toBe('FORBIDDEN');
    expect(deleteBans).not.toHaveBeenCalled();
  });
});
