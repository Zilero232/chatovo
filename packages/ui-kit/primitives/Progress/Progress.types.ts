import type { Progress } from '@base-ui/react/progress';
import type { ComponentProps } from 'react';

export type ProgressProps = Omit<ComponentProps<typeof Progress.Root>, 'className'> & {
  className?: string;
};
