import type { ComponentProps, ElementType, ReactNode } from 'react';

import type { RowVariantProps } from './Row.variants';

export type RowGap = NonNullable<RowVariantProps['gap']>;

export type RowAlign = NonNullable<RowVariantProps['align']>;

export type RowJustify = NonNullable<RowVariantProps['justify']>;

export type RowProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
  gap?: RowGap;
  align?: RowAlign;
  justify?: RowJustify;
  wrap?: boolean;
} & Omit<ComponentProps<T>, 'children'>;
