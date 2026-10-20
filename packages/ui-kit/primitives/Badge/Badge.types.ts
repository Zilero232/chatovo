import type { ComponentProps } from 'react';

import type { BadgeVariantProps } from './Badge.variants';

export type BadgeTone = NonNullable<BadgeVariantProps['tone']>;

export type BadgeSize = NonNullable<BadgeVariantProps['size']>;

export type BadgeProps = ComponentProps<'span'> & {
  tone?: BadgeTone;
  size?: BadgeSize;
};
