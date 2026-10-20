import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';

import s from './Row.module.scss';

export const rowVariants = cva(s.root, {
  variants: {
    gap: {
      '0': s.gap0,
      '1': s.gap1,
      '1.5': s.gap1_5,
      '2': s.gap2,
      '3': s.gap3,
      '4': s.gap4,
      '6': s.gap6
    },
    align: {
      start: s.alignStart,
      center: s.alignCenter,
      end: s.alignEnd,
      baseline: s.alignBaseline,
      stretch: s.alignStretch
    },
    justify: {
      start: s.justifyStart,
      center: s.justifyCenter,
      end: s.justifyEnd,
      between: s.justifyBetween,
      around: s.justifyAround
    },
    wrap: {
      true: s.wrap,
      false: s.nowrap
    }
  },
  defaultVariants: {
    gap: '2',
    align: 'center',
    wrap: false
  }
});

export type RowVariantProps = VariantProps<typeof rowVariants>;
