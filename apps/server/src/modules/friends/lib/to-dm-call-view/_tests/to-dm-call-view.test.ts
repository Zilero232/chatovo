import type { FriendUser } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import type { DmCall } from '../../../friends.types';

import { toDmCallView } from '../to-dm-call-view';

const userOf = (id: string): FriendUser => ({
  id,
  name: id,
  friendTag: id,
  avatarUrl: null,
  verified: false,
  developer: false,
  isOnline: true
});

const ACTIVE: DmCall = {
  id: '0b7d2c4e-1a3f-4c5b-8e6d-9f0a1b2c3d4e',
  roomId: '5f0c3a9e-8f1e-4e2a-9d3b-2c6f7a1b0e4d',
  caller: userOf('ann'),
  callee: userOf('bob'),
  calleeReachable: true,
  state: 'active',
  startedAt: Date.UTC(2026, 9, 29, 12),
  ringEndsAt: null,
  answeredAt: Date.UTC(2026, 9, 29, 12, 0, 5),
  endedAt: null,
  endReason: null,
  inCall: ['ann'],
  everJoined: ['ann', 'bob'],
  graceEndsAt: Date.UTC(2026, 9, 29, 12, 2),
  callerOfflineSince: null,
  legacyAcked: false
};

describe('toDmCallView', () => {
  it('shows the caller an outgoing call to the callee', () => {
    expect(toDmCallView({ call: ACTIVE, viewerId: 'ann', peerBusy: false })).toMatchObject({
      direction: 'outgoing',
      peer: { id: 'bob' },
      selfInCall: true,
      peerInCall: false
    });
  });

  it('shows the callee an incoming call from the caller', () => {
    expect(toDmCallView({ call: ACTIVE, viewerId: 'bob', peerBusy: false })).toMatchObject({
      direction: 'incoming',
      peer: { id: 'ann' },
      selfInCall: false,
      peerInCall: true
    });
  });

  it('shows the countdown only to the side still waiting for the peer', () => {
    expect(toDmCallView({ call: ACTIVE, viewerId: 'ann', peerBusy: false }).peerGraceEndsAt).toBe(
      '2026-10-29T12:02:00.000Z'
    );
    expect(
      toDmCallView({ call: ACTIVE, viewerId: 'bob', peerBusy: false }).peerGraceEndsAt
    ).toBeNull();
  });
});
