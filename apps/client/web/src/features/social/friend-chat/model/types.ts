import type { FriendUser } from '@chatovo/schemas';

export type FriendChatPeer = Pick<
  FriendUser,
  'avatarUrl' | 'developer' | 'id' | 'name' | 'verified'
>;

export type FriendChatSession = {
  peer: FriendChatPeer;
  roomId: string;
};

export type FriendsTabValue = 'add' | 'all' | 'blocked' | 'developers' | 'online' | 'pending';
