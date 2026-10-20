import { Avatar, AvatarFallback, AvatarImage } from '@chatovo/ui-kit';

import { getAvatarColor, getDefaultAvatar, getInitials } from '@/shared/lib';

import type { UserAvatarProps } from './UserAvatar.types';

export const UserAvatar = ({
  name,
  src,
  size,
  sizes,
  colorize = false,
  className,
  fallbackClassName
}: UserAvatarProps) => (
  <Avatar className={className} size={size}>
    <AvatarImage alt={name} sizes={sizes} src={src || getDefaultAvatar(name)} />
    <AvatarFallback
      className={fallbackClassName}
      style={colorize ? { backgroundColor: getAvatarColor(name), color: '#fff' } : undefined}
    >
      {getInitials(name)}
    </AvatarFallback>
  </Avatar>
);
