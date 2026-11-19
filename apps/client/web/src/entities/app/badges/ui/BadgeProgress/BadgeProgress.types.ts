import type { BadgeId } from '@chatovo/schemas';

export type BadgeProgressProps = {
  id: BadgeId;
  tier: number;
  value: number;
  className?: string;
};
