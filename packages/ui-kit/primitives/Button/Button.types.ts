import type { ComponentProps, MouseEvent } from 'react';

import type { ButtonVariantProps } from './Button.variants';

export type ButtonVariant = NonNullable<ButtonVariantProps['variant']>;

export type ButtonSize = NonNullable<ButtonVariantProps['size']>;

export type ButtonProps = Omit<ComponentProps<'button'>, 'onClick'> &
  Pick<ComponentProps<'a'>, 'download' | 'href' | 'rel' | 'target'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  };
