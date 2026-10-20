import type { FriendRequestEntry } from '@chatovo/schemas';

export type FriendRequestListItemProps = {
  entry: FriendRequestEntry;
  isAccepting: boolean;
  isDeclining: boolean;
  onAccept: () => void;
  onDecline: () => void;
};
