import type { BadgeId } from '@chatovo/schemas';

export type BadgeIconSize = 'lg' | 'md' | 'sm';

export type BadgeIconProps = {
  id: BadgeId;
  tier: number;
  size?: BadgeIconSize;
  className?: string;
};
