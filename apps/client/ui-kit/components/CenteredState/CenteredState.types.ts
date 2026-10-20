import type { ReactNode } from 'react';

import type { EmptyStatePatternVariant } from '../../primitives';
import type { ChatoPose } from '../Chato';
import type { CenteredStateVariantProps } from './CenteredState.variants';

export type CenteredStateSize = NonNullable<CenteredStateVariantProps['size']>;

export type CenteredStateProps = {
  action?: ReactNode;
  chato?: ChatoPose;
  className?: string;
  description?: ReactNode;
  icon?: ReactNode;
  pattern?: EmptyStatePatternVariant;
  size?: CenteredStateSize;
  title: ReactNode;
};
