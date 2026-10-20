import type { ComponentProps } from 'react';

import type { SkeletonVariantProps } from './Skeleton.variants';

export type SkeletonShape = NonNullable<SkeletonVariantProps['shape']>;

export type SkeletonProps = {
  width?: string;
} & ComponentProps<'div'> &
  SkeletonVariantProps;
