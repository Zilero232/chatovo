import type { ElementType } from 'react';

import { clsx } from 'clsx';

import type { TextProps } from './Text.types';

import { textVariants } from './Text.variants';

export const Text = <T extends ElementType = 'p'>({
  as,
  size,
  weight,
  tone,
  align,
  truncate,
  className,
  children,
  ...props
}: TextProps<T>) => {
  const Component = as ?? 'p';

  return (
    <Component
      className={clsx(textVariants({ size, weight, tone, align, truncate }), className)}
      data-slot='text'
      {...props}
    >
      {children}
    </Component>
  );
};
