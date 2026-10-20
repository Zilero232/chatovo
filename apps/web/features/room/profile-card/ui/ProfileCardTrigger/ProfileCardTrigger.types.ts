import type { ReactNode } from 'react';

import type { ProfileCardFriendState } from '../ProfileCard/ProfileCard.types';

export type ProfileCardTriggerProps = {
  children: ReactNode;
  className?: string;
  identity: string;
  name: string;
  renderFriendActions?: (state: ProfileCardFriendState) => ReactNode;
};
