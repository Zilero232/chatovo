import type { FriendUser } from '@chatovo/schemas';

export type FriendListItemProps = {
  dmUnread?: number;
  user: FriendUser;
  onOpen: (user: FriendUser) => void;
  onRemove: (user: FriendUser) => void;
};
