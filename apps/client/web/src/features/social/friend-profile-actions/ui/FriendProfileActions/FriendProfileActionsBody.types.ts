import type { FriendshipRelation } from '@chatovo/schemas';
import type { ReactNode } from 'react';

export type FriendProfileRemoveConfirmState = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type FriendProfileActionsBodyProps = {
  friendTag: string;
  renderRemoveConfirm: (state: FriendProfileRemoveConfirmState) => ReactNode;
  state: FriendshipRelation;
  userId: string;
  onOpenChat: () => void;
};
