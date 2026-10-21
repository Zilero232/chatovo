import type { FriendCallStatus, FriendUser } from '@chatovo/schemas';

export type PendingFriendCall = {
  callee: FriendUser;
  calleeId: string;
  caller: FriendUser;
  expiresAt: number;
  roomId: string;
  status: FriendCallStatus;
};

export type ClearCallsBetweenInput = {
  userId: string;
  otherUserId: string;
};
