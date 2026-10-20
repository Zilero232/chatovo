import type { FriendEntry, FriendUser } from '@chatovo/schemas';

export type FriendsListProps = {
  countLabel: string;
  items: FriendEntry[];
  getUnread: (userId: string) => number;
  onOpen: (user: FriendUser) => void;
  onRemove: (user: FriendUser) => void;
};
