import type { RoomParticipant } from '@chatovo/schemas';

import { beforeEach, describe, expect, it } from 'vitest';

import {
  addParticipant,
  clearRoom,
  getAdminSnapshot,
  getPresenceSnapshots,
  getSnapshot,
  markDmRoom,
  patchParticipant
} from '../presence-store';

const participant = (identity: string, invisible = false): RoomParticipant => ({
  identity,
  name: identity,
  micMuted: true,
  deafened: false,
  invisible,
  activity: null,
  verified: false,
  developer: false,
  role: 'user',
  profileUrl: null,
  avatarUrl: null,
  bannerColor: null
});

describe('presence snapshots', () => {
  beforeEach(() => {
    clearRoom('room-a');
  });

  it('keeps invisible participants out of the public snapshot', () => {
    addParticipant('room-a', participant('user-1'));
    addParticipant('room-a', participant('ghost-admin', true));

    expect(getSnapshot().rooms['room-a']?.map((p) => p.identity)).toEqual(['user-1']);
  });

  it('exposes invisible participants to the admin snapshot', () => {
    addParticipant('room-a', participant('user-1'));
    addParticipant('room-a', participant('ghost-admin', true));

    expect(getAdminSnapshot().rooms['room-a']?.map((p) => p.identity)).toEqual([
      'user-1',
      'ghost-admin'
    ]);
  });

  it('omits a room from the public snapshot when only invisible admins remain', () => {
    addParticipant('room-a', participant('ghost-admin', true));

    expect(getSnapshot().rooms['room-a']).toBeUndefined();
    expect(getAdminSnapshot().rooms['room-a']).toHaveLength(1);
  });
});

describe('patchParticipant', () => {
  beforeEach(() => {
    clearRoom('room-b');
    addParticipant('room-b', participant('user-1'));
  });

  const readParticipant = () => getSnapshot().rooms['room-b']?.[0];

  it('publishes the activity a participant shares', () => {
    patchParticipant('room-b', 'user-1', { activity: 'Dota 2' });

    expect(readParticipant()?.activity).toBe('Dota 2');
  });

  it('clears the activity when null is sent', () => {
    patchParticipant('room-b', 'user-1', { activity: 'Dota 2' });
    patchParticipant('room-b', 'user-1', { activity: null });

    expect(readParticipant()?.activity).toBeNull();
  });

  it('leaves the activity alone when the patch omits it', () => {
    patchParticipant('room-b', 'user-1', { activity: 'Dota 2' });
    patchParticipant('room-b', 'user-1', { deafened: true });

    expect(readParticipant()?.activity).toBe('Dota 2');
    expect(readParticipant()?.deafened).toBe(true);
  });

  it('ignores a patch for a participant who is not in the room', () => {
    patchParticipant('room-b', 'stranger', { activity: 'Dota 2' });

    expect(readParticipant()?.activity).toBeNull();
  });
});

describe('DM room presence', () => {
  beforeEach(() => {
    clearRoom('dm-room');
  });

  it('keeps a DM call out of the public and the staff snapshot', () => {
    markDmRoom({ roomId: 'dm-room', memberIds: ['ann', 'bob'] });
    addParticipant('dm-room', participant('ann'));

    expect(getSnapshot().rooms).not.toHaveProperty('dm-room');
    expect(getAdminSnapshot().rooms).not.toHaveProperty('dm-room');
  });

  it('hands the DM room over separately with its two members', () => {
    markDmRoom({ roomId: 'dm-room', memberIds: ['ann', 'bob'] });
    addParticipant('dm-room', participant('ann'));

    expect(getPresenceSnapshots().dmRooms).toContainEqual({
      roomId: 'dm-room',
      memberIds: ['ann', 'bob'],
      participants: [participant('ann')]
    });
  });
});
