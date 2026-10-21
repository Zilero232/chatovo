import { describe, expect, it } from 'vitest';

import { canModerateRoom } from '../can-moderate-room';

const OWNER = 'owner-1';

const groupRoom = { kind: 'group', ownerId: OWNER };
const dmRoom = { kind: 'dm', ownerId: OWNER };

describe('canModerateRoom', () => {
  it('lets the owner moderate their group room', () => {
    expect(canModerateRoom({ room: groupRoom, userId: OWNER, isAdmin: false })).toBe(true);
  });

  it('lets an app admin moderate a room they do not own', () => {
    expect(canModerateRoom({ room: groupRoom, userId: 'admin-1', isAdmin: true })).toBe(true);
  });

  it('refuses a regular participant', () => {
    expect(canModerateRoom({ room: groupRoom, userId: 'guest-1', isAdmin: false })).toBe(false);
  });

  it('refuses everyone in a dm, even its creator and an admin', () => {
    expect(canModerateRoom({ room: dmRoom, userId: OWNER, isAdmin: false })).toBe(false);
    expect(canModerateRoom({ room: dmRoom, userId: 'admin-1', isAdmin: true })).toBe(false);
  });
});
