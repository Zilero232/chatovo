import type { Separator } from '@base-ui/react/separator';
import type { ComponentProps } from 'react';

export type SeparatorProps = Omit<ComponentProps<typeof Separator>, 'className'> & {
  className?: string;
};
