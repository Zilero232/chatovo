import type { Checkbox } from '@base-ui/react/checkbox';
import type { ComponentProps } from 'react';

export type CheckboxProps = Omit<
  ComponentProps<typeof Checkbox.Root>,
  'children' | 'className' | 'onCheckedChange'
> & {
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
};
