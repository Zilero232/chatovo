import type { Avatar } from '@chatovo/ui-kit';
import type { ComponentProps } from 'react';

export type UserAvatarProps = {
  className?: string;
  colorize?: boolean;
  fallbackClassName?: string;
  name: string;
  size?: ComponentProps<typeof Avatar>['size'];
  sizes?: string;
  src?: string | null;
};
