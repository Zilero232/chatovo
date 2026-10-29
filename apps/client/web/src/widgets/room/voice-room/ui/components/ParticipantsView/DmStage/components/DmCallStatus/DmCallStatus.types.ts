import type { FriendUser } from '@chatovo/schemas';

export type DmCallStatusProps = {
  canRingAgain: boolean;
  isPulsing: boolean;
  isRingingAgain: boolean;
  peer: FriendUser | null;
  status: string;
  onRingAgain: () => void;
};
