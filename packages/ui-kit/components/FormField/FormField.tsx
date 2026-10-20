import { clsx } from 'clsx';
import { cloneElement, useId } from 'react';

import type { FormFieldProps } from './FormField.types';

import { Label, Text } from '../../primitives';

import s from './FormField.module.scss';

export const FormField = ({ htmlFor, label, children, hint, error, className }: FormFieldProps) => {
  const hintId = useId();
  const errorId = useId();

  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ');

  // eslint-disable-next-line react/no-clone-element -- aria-describedby/aria-invalid must land on the caller's own control
  const control = cloneElement(children, {
    'aria-describedby': describedBy || undefined,
    'aria-invalid': Boolean(error)
  });

  return (
    <div className={clsx(s.root, className)}>
      <Label className={s.label} htmlFor={htmlFor}>
        {label}
      </Label>
      {control}
      {hint && (
        <Text id={hintId} size='xs' tone='muted'>
          {hint}
        </Text>
      )}
      {error && (
        <Text id={errorId} role='alert' size='xs' tone='destructive'>
          {error}
        </Text>
      )}
    </div>
  );
};
