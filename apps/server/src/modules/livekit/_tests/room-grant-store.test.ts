import { beforeEach, describe, expect, it } from 'vitest';

import {
  grantRoomAccess,
  hasRoomGrant,
  revokeRoomGrant,
  revokeRoomGrants,
  revokeUserGrants
} from '../room-grant-store';

describe('revokeRoomGrant', () => {
  beforeEach(() => {
    revokeRoomGrants('room-a');
    revokeRoomGrants('room-b');
  });

  it('drops the grant one user holds for one room', () => {
    grantRoomAccess({ roomId: 'room-a', userId: 'user-1' });

    revokeRoomGrant({ roomId: 'room-a', userId: 'user-1' });

    expect(hasRoomGrant('room-a', 'user-1')).toBe(false);
  });

  it('keeps that user’s grants for other rooms and other users’ grants for that room', () => {
    grantRoomAccess({ roomId: 'room-a', userId: 'user-1' });
    grantRoomAccess({ roomId: 'room-b', userId: 'user-1' });
    grantRoomAccess({ roomId: 'room-a', userId: 'user-2' });

    revokeRoomGrant({ roomId: 'room-a', userId: 'user-1' });

    expect(hasRoomGrant('room-b', 'user-1')).toBe(true);
    expect(hasRoomGrant('room-a', 'user-2')).toBe(true);
  });
});

describe('revokeUserGrants', () => {
  beforeEach(() => {
    revokeRoomGrants('room-a');
    revokeRoomGrants('room-b');
  });

  it('drops the grants a user holds across every room', () => {
    grantRoomAccess({ roomId: 'room-a', userId: 'user-1' });
    grantRoomAccess({ roomId: 'room-b', userId: 'user-1' });

    revokeUserGrants('user-1');

    expect(hasRoomGrant('room-a', 'user-1')).toBe(false);
    expect(hasRoomGrant('room-b', 'user-1')).toBe(false);
  });

  it('leaves other users in the same room untouched', () => {
    grantRoomAccess({ roomId: 'room-a', userId: 'user-1' });
    grantRoomAccess({ roomId: 'room-a', userId: 'user-2' });

    revokeUserGrants('user-1');

    expect(hasRoomGrant('room-a', 'user-2')).toBe(true);
  });

  it('does not match a user whose id merely ends with the revoked one', () => {
    grantRoomAccess({ roomId: 'room-a', userId: 'admin-user-1' });

    revokeUserGrants('user-1');

    expect(hasRoomGrant('room-a', 'admin-user-1')).toBe(true);
  });
});
