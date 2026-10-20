import type { ComponentProps, ElementType, ReactNode } from 'react';

import type { StackVariantProps } from './Stack.variants';

export type StackGap = NonNullable<StackVariantProps['gap']>;

export type StackAlign = NonNullable<StackVariantProps['align']>;

export type StackJustify = NonNullable<StackVariantProps['justify']>;

export type StackProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
} & Omit<ComponentProps<T>, 'children'>;
