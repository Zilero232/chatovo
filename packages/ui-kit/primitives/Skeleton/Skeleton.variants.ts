import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';

import s from './Skeleton.module.scss';

export const skeletonVariants = cva(s.root, {
  variants: {
    shape: {
      block: s.shapeBlock,
      circle: s.shapeCircle,
      text: s.shapeText,
      title: s.shapeTitle
    }
  },
  defaultVariants: {
    shape: 'block'
  }
});

export type SkeletonVariantProps = VariantProps<typeof skeletonVariants>;
