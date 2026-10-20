'use client';

import { clsx } from 'clsx';
import { Search } from 'lucide-react';

import type { SearchFieldProps } from './SearchField.types';

import s from './SearchField.module.scss';

export const SearchField = ({
  value,
  variant = 'plain',
  trail,
  inputRef,
  className,
  onValueChange,
  ...props
}: SearchFieldProps) => (
  <label className={clsx(s.field, s[variant], className)} data-slot='search-field'>
    <Search className={s.icon} />
    <input
      ref={inputRef}
      className={s.input}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      {...props}
    />
    {trail}
  </label>
);
