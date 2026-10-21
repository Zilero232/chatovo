export type FindFriendshipInput = {
  userId: string;
  otherUserId: string;
};

export type GetFriendshipRelationInput = {
  userId: string;
  otherUserId: string;
};

export type CreateFriendshipRequestInput = {
  requesterId: string;
  addresseeId: string;
};

export type SendFriendRequestInput = {
  requesterId: string;
  tag: string;
};

export type AcceptFriendRequestInput = {
  userId: string;
  friendshipId: string;
};

export type DeclineFriendRequestInput = {
  userId: string;
  friendshipId: string;
};

export type RemoveFriendshipInput = {
  userId: string;
  otherUserId: string;
};

export type UserBlockState = {
  blockedByMe: boolean;
  blockedByThem: boolean;
};

export type BroadcastFriendPresenceInput = {
  userId: string;
  isOnline: boolean;
};
