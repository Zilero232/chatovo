import type { BadgeProps } from './Badge.types';

import { badgeVariants } from './Badge.variants';

export const Badge = ({ className, tone = 'muted', size = 'md', ...props }: BadgeProps) => (
  <span className={badgeVariants({ tone, size, className })} {...props} />
);
