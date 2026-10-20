import type { Tooltip } from '@base-ui/react/tooltip';
import type { ComponentProps, ReactNode } from 'react';

export type TooltipSide = ComponentProps<typeof Tooltip.Positioner>['side'];

export type TooltipProviderProps = {
  children?: ReactNode;
  delay?: number;
  delayDuration?: number;
};

export type TooltipProps = Omit<
  ComponentProps<typeof Tooltip.Root>,
  'children' | 'delay' | 'open'
> & {
  delay?: number;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  disableHoverablePopup?: boolean;
  open?: boolean;
  children?: ReactNode;
};

export type TooltipContentProps = {
  children?: ReactNode;
  className?: string;
  side?: TooltipSide;
  sideOffset?: number;
};
