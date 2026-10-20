import { FormField, Input, Textarea } from '@chatovo/ui-kit';

import type { ProfileTextFieldProps } from './ProfileTextField.types';

export const ProfileTextField = ({
  id,
  label,
  hint,
  error,
  registration,
  autoComplete,
  placeholder,
  type,
  rows,
  multiline
}: ProfileTextFieldProps) => (
  <FormField error={error} hint={error ? undefined : hint} htmlFor={id} label={label}>
    {multiline ? (
      <Textarea id={id} placeholder={placeholder} rows={rows} {...registration} />
    ) : (
      <Input
        autoComplete={autoComplete}
        id={id}
        placeholder={placeholder}
        type={type}
        {...registration}
      />
    )}
  </FormField>
);
