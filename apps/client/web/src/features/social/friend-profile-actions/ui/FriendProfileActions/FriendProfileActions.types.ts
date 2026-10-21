import type { ReactNode } from 'react';

import type {
  FriendProfileBlockActionState,
  FriendProfileRemoveConfirmState
} from './FriendProfileActionsBody.types';

export type FriendProfileActionsProps = {
  friendTag: string;
  renderBlockAction: (state: FriendProfileBlockActionState) => ReactNode;
  renderRemoveConfirm: (state: FriendProfileRemoveConfirmState) => ReactNode;
  userId: string;
  onOpenChat: () => void;
};
