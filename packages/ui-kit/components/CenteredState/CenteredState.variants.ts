import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';

import s from './CenteredState.module.scss';

export const centeredStateVariants = cva(s.root, {
  variants: {
    size: {
      sm: s.sizeSm,
      md: s.sizeMd
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const centeredStateIconBoxVariants = cva(s.iconBox, {
  variants: {
    size: {
      sm: s.iconBoxSm,
      md: s.iconBoxMd
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const centeredStateTitleVariants = cva(s.title, {
  variants: {
    size: {
      sm: s.titleSm,
      md: s.titleMd
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export type CenteredStateVariantProps = VariantProps<typeof centeredStateVariants>;
