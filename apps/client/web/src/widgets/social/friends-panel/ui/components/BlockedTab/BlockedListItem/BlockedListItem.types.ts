import type { FriendUser } from '@chatovo/schemas';

export type BlockedListItemProps = {
  isBusy: boolean;
  user: FriendUser;
  onUnblock: () => void;
};
