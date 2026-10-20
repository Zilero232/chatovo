import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';

import s from './Button.module.scss';

export const buttonVariants = cva(s.root, {
  variants: {
    variant: {
      default: s.default,
      destructive: s.destructive,
      outline: s.outline,
      secondary: s.secondary,
      ghost: s.ghost,
      link: s.link
    },
    size: {
      default: s.sizeDefault,
      xs: s.sizeXs,
      sm: s.sizeSm,
      lg: s.sizeLg,
      icon: s.sizeIcon,
      'icon-xs': s.sizeIconXs,
      'icon-sm': s.sizeIconSm,
      'icon-lg': s.sizeIconLg
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
