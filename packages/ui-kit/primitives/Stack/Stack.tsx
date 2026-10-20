import type { ComponentProps, ElementType } from 'react';

import type { StackProps } from './Stack.types';

import { stackVariants } from './Stack.variants';

export const Stack = <T extends ElementType = 'div'>({
  as,
  gap = '2',
  align,
  justify,
  className,
  children,
  ...props
}: StackProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component
      className={stackVariants({ gap, align, justify, className })}
      {...(props as ComponentProps<T>)}
    >
      {children}
    </Component>
  );
};
