import { beforeEach, describe, expect, it, vi } from 'vitest';

const assertCanManageRoom = vi.fn();
const retireRoom = vi.fn();
const grantRoomAccess = vi.fn();
const revokeRoomGrants = vi.fn();
const emitToAll = vi.fn();
const createRoom = vi.fn();
const updateRoom = vi.fn();
const deleteRoom = vi.fn();
const findRoomByName = vi.fn();

vi.mock('../../../../lib', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  assertCanManageRoom: (input: unknown) => assertCanManageRoom(input),
  getUserDisplayName: async () => 'Owner',
  hashRoomPassword: async (password: string) => `hashed:${password}`,
  retireRoom: (roomId: string) => retireRoom(roomId)
}));

vi.mock('../../../livekit', () => ({
  grantRoomAccess: (input: unknown) => grantRoomAccess(input),
  revokeRoomGrants: (roomId: string) => revokeRoomGrants(roomId)
}));

vi.mock('../../../realtime', () => ({
  emitToAll: (message: unknown) => emitToAll(message)
}));

const { RoomsService } = await import('../rooms.service');

const OWNER = 'owner-1';
const ROOM_ID = 'room-1';
const ROOM = { id: ROOM_ID, name: 'evening', kind: 'group', isPrivate: true, ownerId: OWNER };

const prisma = {
  room: {
    create: (...args: unknown[]) => createRoom(...args),
    update: (...args: unknown[]) => updateRoom(...args),
    delete: (...args: unknown[]) => deleteRoom(...args),
    findUnique: (...args: unknown[]) => findRoomByName(...args)
  }
};

const service = () => new RoomsService(prisma as never, { emit: vi.fn() } as never);

describe('RoomsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    assertCanManageRoom.mockResolvedValue({ ...ROOM, password: 'hashed:old' });
    findRoomByName.mockResolvedValue(null);
    createRoom.mockResolvedValue(ROOM);
    updateRoom.mockResolvedValue(ROOM);
    deleteRoom.mockResolvedValue({ name: ROOM.name });
  });

  it('lets the creator into a new private room once, without the password', async () => {
    await service().createRoom({
      input: { name: 'evening', isPrivate: true, password: 'secret' },
      ownerId: OWNER
    });

    expect(grantRoomAccess).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: OWNER });
    expect(emitToAll).toHaveBeenCalledWith({ type: 'room.upserted', room: ROOM });
  });

  it('keeps everyone’s password pass when the room is only renamed', async () => {
    await service().updateRoom({
      roomId: ROOM_ID,
      input: { name: 'late evening', isPrivate: true },
      userId: OWNER
    });

    expect(revokeRoomGrants).not.toHaveBeenCalled();
  });

  it('drops every pass but the owner’s when the password changes', async () => {
    await service().updateRoom({
      roomId: ROOM_ID,
      input: { isPrivate: true, password: 'new-secret' },
      userId: OWNER
    });

    expect(revokeRoomGrants).toHaveBeenCalledWith(ROOM_ID);
    expect(grantRoomAccess).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: OWNER });
  });

  it('drops the passes when a private room turns public', async () => {
    await service().updateRoom({ roomId: ROOM_ID, input: { isPrivate: false }, userId: OWNER });

    expect(revokeRoomGrants).toHaveBeenCalledWith(ROOM_ID);
  });

  it('retires a deleted room everywhere outside the database', async () => {
    await service().deleteRoom({ roomId: ROOM_ID, userId: OWNER });

    expect(retireRoom).toHaveBeenCalledWith(ROOM_ID);
  });
});
