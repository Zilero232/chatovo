import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';

import s from './Text.module.scss';

export const textVariants = cva(s.root, {
  variants: {
    size: {
      xs: s.sizeXs,
      sm: s.sizeSm,
      base: s.sizeBase,
      lg: s.sizeLg,
      xl: s.sizeXl,
      '2xl': s.size2xl,
      '3xl': s.size3xl
    },
    weight: {
      normal: s.weightNormal,
      medium: s.weightMedium,
      semibold: s.weightSemibold,
      bold: s.weightBold
    },
    tone: {
      default: s.toneDefault,
      muted: s.toneMuted,
      subtle: s.toneSubtle,
      brand: s.toneBrand,
      destructive: s.toneDestructive,
      inherit: s.toneInherit
    },
    align: {
      start: s.alignStart,
      center: s.alignCenter,
      end: s.alignEnd
    },
    truncate: {
      true: s.truncate
    }
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    tone: 'default'
  }
});

export type TextVariantProps = VariantProps<typeof textVariants>;
