import type { ReactNode } from 'react';

export type AvatarWithBadgesProps = {
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
  children: ReactNode;
  className?: string;
  topLeft?: ReactNode;
  topRight?: ReactNode;
};
