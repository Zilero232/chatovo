import type { ComponentProps } from 'react';

export type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'>;
