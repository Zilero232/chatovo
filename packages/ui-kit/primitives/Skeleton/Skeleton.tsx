import { clsx } from 'clsx';

import type { SkeletonProps } from './Skeleton.types';

import { skeletonVariants } from './Skeleton.variants';

export const Skeleton = ({ className, shape, width, style, ...props }: SkeletonProps) => (
  <div
    className={clsx('shimmer', skeletonVariants({ shape }), className)}
    data-slot='skeleton'
    style={width ? { ...style, width } : style}
    {...props}
  />
);
