import type { ComponentProps, ReactNode } from 'react';

import type { Button } from '../../primitives/Button';
import type { TooltipContent } from '../../primitives/Tooltip';

export type IconButtonWithTooltipProps = Omit<ComponentProps<typeof Button>, 'children'> & {
  icon: ReactNode;
  label: string;
  tooltip?: ReactNode;
  tooltipSide?: ComponentProps<typeof TooltipContent>['side'];
  tooltipSideOffset?: ComponentProps<typeof TooltipContent>['sideOffset'];
};
