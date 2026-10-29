import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { hashRoomPassword } from '../../../../../lib';
import { grantRoomAccess, revokeRoomGrants } from '../../../room-grant-store';
import { assertRoomAccess } from '../assert-room-access';

const OWNER = 'owner-1';
const STRANGER = 'stranger-1';

let privateRoom: Parameters<typeof assertRoomAccess>[0]['room'];

beforeAll(async () => {
  privateRoom = {
    id: 'room-private',
    kind: 'group',
    isPrivate: true,
    password: await hashRoomPassword('secret')
  };
});

describe('assertRoomAccess', () => {
  beforeEach(() => {
    revokeRoomGrants('room-private');
  });

  it('lets the creator straight in right after creating the room', async () => {
    grantRoomAccess({ roomId: 'room-private', userId: OWNER });

    await expect(assertRoomAccess({ room: privateRoom, userId: OWNER })).resolves.toBeUndefined();
  });

  it('asks even the owner for the password once their pass has expired', async () => {
    await expect(assertRoomAccess({ room: privateRoom, userId: OWNER })).rejects.toMatchObject({
      response: { code: 'ROOM_PASSWORD_REQUIRED' }
    });
  });

  it('lets back in a user who already entered the password', async () => {
    grantRoomAccess({ roomId: 'room-private', userId: 'returning-1' });

    await expect(
      assertRoomAccess({ room: privateRoom, userId: 'returning-1' })
    ).resolves.toBeUndefined();
  });

  it('asks for the password with a 403, never a 401 that the client would read as a dead session', async () => {
    await expect(assertRoomAccess({ room: privateRoom, userId: STRANGER })).rejects.toMatchObject({
      status: 403
    });
  });

  it('asks a stranger for the password', async () => {
    await expect(assertRoomAccess({ room: privateRoom, userId: STRANGER })).rejects.toMatchObject({
      response: { code: 'ROOM_PASSWORD_REQUIRED' }
    });
  });

  it('refuses a stranger with a wrong password', async () => {
    await expect(
      assertRoomAccess({ room: privateRoom, userId: STRANGER, password: 'nope' })
    ).rejects.toMatchObject({ response: { code: 'ROOM_PASSWORD_INVALID' } });
  });

  it('lets a stranger in with the right password', async () => {
    await expect(
      assertRoomAccess({ room: privateRoom, userId: STRANGER, password: 'secret' })
    ).resolves.toBeUndefined();
  });

  it('lets anyone into a public room', async () => {
    await expect(
      assertRoomAccess({ room: { ...privateRoom, isPrivate: false }, userId: STRANGER })
    ).resolves.toBeUndefined();
  });

  it('asks for the password when the only pass came from joining invisibly', async () => {
    grantRoomAccess({ roomId: 'room-private', userId: 'staff-1', isHidden: true });

    await expect(assertRoomAccess({ room: privateRoom, userId: 'staff-1' })).rejects.toMatchObject({
      response: { code: 'ROOM_PASSWORD_REQUIRED' }
    });
  });

  it('keeps a pass earned with the password when the same person later joins invisibly', async () => {
    grantRoomAccess({ roomId: 'room-private', userId: 'staff-1' });
    grantRoomAccess({ roomId: 'room-private', userId: 'staff-1', isHidden: true });

    await expect(
      assertRoomAccess({ room: privateRoom, userId: 'staff-1' })
    ).resolves.toBeUndefined();
  });
});
