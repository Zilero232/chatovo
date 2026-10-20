import type { ComponentProps, ElementType, ReactNode } from 'react';

import type { TextVariantProps } from './Text.variants';

export type TextSize = NonNullable<TextVariantProps['size']>;

export type TextWeight = NonNullable<TextVariantProps['weight']>;

export type TextTone = NonNullable<TextVariantProps['tone']>;

export type TextAlign = NonNullable<TextVariantProps['align']>;

export type TextProps<T extends ElementType = 'p'> = {
  as?: T;
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  align?: TextAlign;
  truncate?: boolean;
  children?: ReactNode;
} & Omit<ComponentProps<T>, 'children' | 'color'>;
