import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';

import s from './Badge.module.scss';

export const badgeVariants = cva(s.root, {
  variants: {
    tone: {
      primary: s.tonePrimary,
      muted: s.toneMuted,
      amber: s.toneAmber,
      danger: s.toneDanger,
      dark: s.toneDark,
      outline: s.toneOutline
    },
    size: {
      sm: s.sizeSm,
      md: s.sizeMd,
      lg: s.sizeLg
    }
  },
  defaultVariants: {
    tone: 'muted',
    size: 'md'
  }
});

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
