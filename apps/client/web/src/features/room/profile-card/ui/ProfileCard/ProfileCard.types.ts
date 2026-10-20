import type { ReactNode } from 'react';

export type ProfileCardFriendState = {
  avatarUrl: string | null;
  developer: boolean;
  displayName: string;
  friendTag: string;
  userId: string;
  verified: boolean;
};

export type ProfileCardProps = {
  identity: string;
  name: string;
  renderFriendActions?: (state: ProfileCardFriendState) => ReactNode;
};
