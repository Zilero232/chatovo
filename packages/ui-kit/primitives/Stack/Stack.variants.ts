import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';

import s from './Stack.module.scss';

export const stackVariants = cva(s.root, {
  variants: {
    gap: {
      '0': s.gap0,
      '1': s.gap1,
      '1.5': s.gap1_5,
      '2': s.gap2,
      '3': s.gap3,
      '4': s.gap4,
      '6': s.gap6,
      '8': s.gap8
    },
    align: {
      start: s.alignStart,
      center: s.alignCenter,
      end: s.alignEnd,
      stretch: s.alignStretch
    },
    justify: {
      start: s.justifyStart,
      center: s.justifyCenter,
      end: s.justifyEnd,
      between: s.justifyBetween
    }
  },
  defaultVariants: {
    gap: '2'
  }
});

export type StackVariantProps = VariantProps<typeof stackVariants>;
