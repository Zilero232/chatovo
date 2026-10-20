import { clsx } from 'clsx';

import type { InputProps } from './Input.types';

import s from './Input.module.scss';

const Input = ({ className, type, ...props }: InputProps) => (
  <input className={clsx(s.root, className)} data-slot='input' type={type} {...props} />
);

export { Input };
