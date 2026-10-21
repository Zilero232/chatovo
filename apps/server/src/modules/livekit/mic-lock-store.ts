import type { MicLockInput } from './livekit.types';

const locks = new Set<string>();

const key = ({ roomId, userId }: MicLockInput) => `${roomId}:${userId}`;

export const lockMic = (input: MicLockInput): void => {
  locks.add(key(input));
};

export const unlockMic = (input: MicLockInput): void => {
  locks.delete(key(input));
};

export const isMicLocked = (input: MicLockInput): boolean => locks.has(key(input));

export const clearRoomMicLocks = (roomId: string): void => {
  for (const lockKey of locks) {
    if (lockKey.startsWith(`${roomId}:`)) {
      locks.delete(lockKey);
    }
  }
};
