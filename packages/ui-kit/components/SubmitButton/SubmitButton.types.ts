import type { ComponentProps, ReactNode } from 'react';

import type { Button } from '../../primitives/Button';

export type SubmitButtonProps = ComponentProps<typeof Button> & {
  isPending?: boolean;
  children: ReactNode;
};
