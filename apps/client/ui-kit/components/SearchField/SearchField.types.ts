import type { ComponentProps, ReactNode, Ref } from 'react';

export type SearchFieldVariant = 'plain';

export type SearchFieldProps = Omit<ComponentProps<'input'>, 'onChange' | 'value'> & {
  value: string;
  variant?: SearchFieldVariant;
  trail?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
  className?: string;
  onValueChange: (value: string) => void;
};
