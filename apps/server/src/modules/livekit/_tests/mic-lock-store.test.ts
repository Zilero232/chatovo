import { beforeEach, describe, expect, it } from 'vitest';

import { clearRoomMicLocks, isMicLocked, lockMic, unlockMic } from '../mic-lock-store';

describe('mic-lock-store', () => {
  beforeEach(() => {
    clearRoomMicLocks('room-a');
    clearRoomMicLocks('room-b');
  });

  it('keeps a lock until it is lifted, so a rejoin in between stays muted', () => {
    lockMic({ roomId: 'room-a', userId: 'user-1' });

    expect(isMicLocked({ roomId: 'room-a', userId: 'user-1' })).toBe(true);

    unlockMic({ roomId: 'room-a', userId: 'user-1' });

    expect(isMicLocked({ roomId: 'room-a', userId: 'user-1' })).toBe(false);
  });

  it('scopes a lock to one room', () => {
    lockMic({ roomId: 'room-a', userId: 'user-1' });

    expect(isMicLocked({ roomId: 'room-b', userId: 'user-1' })).toBe(false);
  });

  it('drops every lock of a room once it empties, leaving other rooms alone', () => {
    lockMic({ roomId: 'room-a', userId: 'user-1' });
    lockMic({ roomId: 'room-a', userId: 'user-2' });
    lockMic({ roomId: 'room-b', userId: 'user-1' });

    clearRoomMicLocks('room-a');

    expect(isMicLocked({ roomId: 'room-a', userId: 'user-1' })).toBe(false);
    expect(isMicLocked({ roomId: 'room-a', userId: 'user-2' })).toBe(false);
    expect(isMicLocked({ roomId: 'room-b', userId: 'user-1' })).toBe(true);
  });

  it('does not clear a room whose id merely starts with the emptied one', () => {
    lockMic({ roomId: 'room-ab', userId: 'user-1' });

    clearRoomMicLocks('room-a');

    expect(isMicLocked({ roomId: 'room-ab', userId: 'user-1' })).toBe(true);

    clearRoomMicLocks('room-ab');
  });
});
