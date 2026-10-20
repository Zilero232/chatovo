import type { ReactNode } from 'react';

import type { FriendProfileRemoveConfirmState } from './FriendProfileActionsBody.types';

export type FriendProfileActionsProps = {
  friendTag: string;
  renderRemoveConfirm: (state: FriendProfileRemoveConfirmState) => ReactNode;
  userId: string;
  onOpenChat: () => void;
};
