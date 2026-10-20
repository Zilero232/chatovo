import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export type ProfileTextFieldProps = {
  autoComplete?: string;
  error?: ReactNode;
  hint: ReactNode;
  id: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  rows?: number;
  type?: HTMLInputTypeAttribute;
};
