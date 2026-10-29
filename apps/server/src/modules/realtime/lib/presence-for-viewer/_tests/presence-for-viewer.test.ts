import type { RoomParticipant } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import type { PresenceSnapshots } from '../../../realtime.types';

import { presenceForViewer } from '../presence-for-viewer';

const participant = (identity: string, invisible = false) =>
  ({ identity, invisible }) as RoomParticipant;

const SNAPSHOTS: PresenceSnapshots = {
  public: { rooms: { lobby: [participant('x')] }, lobbyOnline: 3 },
  admin: { rooms: { lobby: [participant('x'), participant('mod', true)] }, lobbyOnline: 3 },
  dmRooms: [{ roomId: 'dm-1', memberIds: ['ann', 'bob'], participants: [participant('ann')] }]
};

describe('presenceForViewer', () => {
  it('adds a DM room only for its two members', () => {
    expect(
      presenceForViewer({ snapshots: SNAPSHOTS, userId: 'ann', canSeeInvisible: false }).rooms
    ).toHaveProperty('dm-1');
    expect(
      presenceForViewer({ snapshots: SNAPSHOTS, userId: 'eve', canSeeInvisible: false }).rooms
    ).not.toHaveProperty('dm-1');
  });

  it('keeps a DM room hidden from staff who are not in it', () => {
    expect(
      presenceForViewer({ snapshots: SNAPSHOTS, userId: 'mod', canSeeInvisible: true }).rooms
    ).not.toHaveProperty('dm-1');
  });

  it('starts from the staff snapshot for a socket that may see invisible people', () => {
    expect(
      presenceForViewer({ snapshots: SNAPSHOTS, userId: 'mod', canSeeInvisible: true }).rooms.lobby
    ).toHaveLength(2);
  });
});
