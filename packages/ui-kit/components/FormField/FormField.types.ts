import type { AriaAttributes, ReactElement, ReactNode } from 'react';

export type FormFieldControlProps = Pick<AriaAttributes, 'aria-describedby' | 'aria-invalid'>;

export type FormFieldProps = {
  children: ReactElement<FormFieldControlProps>;
  className?: string;
  error?: ReactNode;
  hint?: ReactNode;
  htmlFor: string;
  label: ReactNode;
};
