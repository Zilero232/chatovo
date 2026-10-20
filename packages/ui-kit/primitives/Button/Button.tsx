import type { ComponentProps } from 'react';

import { isNullish } from 'remeda';

import type { ButtonProps } from './Button.types';

import { buttonVariants } from './Button.variants';

const Button = ({
  className,
  variant = 'default',
  size = 'default',
  disabled,
  onClick,
  href,
  target,
  rel,
  download,
  type = 'button',
  children,
  ...props
}: ButtonProps) => {
  const resolvedClassName = buttonVariants({ variant, size, className });

  if (!isNullish(href)) {
    return (
      <a
        data-size={size}
        data-slot='button'
        data-variant={variant}
        download={download}
        href={href}
        rel={rel}
        target={target}
        onClick={onClick}
        {...(props as ComponentProps<'a'>)}
        className={resolvedClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      data-size={size}
      data-slot='button'
      data-variant={variant}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...props}
      className={resolvedClassName}
    >
      {children}
    </button>
  );
};

export { Button };
