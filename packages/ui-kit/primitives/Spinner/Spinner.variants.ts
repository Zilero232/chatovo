import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';

import s from './Spinner.module.scss';

export const spinnerVariants = cva(s.root, {
  variants: {
    size: {
      xs: s.sizeXs,
      sm: s.sizeSm,
      md: s.sizeMd,
      lg: s.sizeLg,
      xl: s.sizeXl
    }
  },
  defaultVariants: {
    size: 'sm'
  }
});

export type SpinnerVariantProps = VariantProps<typeof spinnerVariants>;
