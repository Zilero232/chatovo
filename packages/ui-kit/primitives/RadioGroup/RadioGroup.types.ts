import type { Radio } from '@base-ui/react/radio';
import type { RadioGroup } from '@base-ui/react/radio-group';
import type { ComponentProps } from 'react';

export type RadioGroupProps = Omit<
  ComponentProps<typeof RadioGroup>,
  'className' | 'onValueChange'
> & {
  className?: string;
  onValueChange?: (value: unknown) => void;
};

export type RadioGroupItemProps = Omit<ComponentProps<typeof Radio.Root>, 'className'> & {
  className?: string;
};
