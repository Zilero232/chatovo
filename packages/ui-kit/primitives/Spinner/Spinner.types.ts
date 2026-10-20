import type { Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';

import type { SpinnerVariantProps } from './Spinner.variants';

export type SpinnerProps = Omit<ComponentProps<typeof Loader2>, 'size'> &
  SpinnerVariantProps & {
    decorative?: boolean;
  };
