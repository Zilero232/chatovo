import type { IconButtonWithTooltipProps } from './IconButtonWithTooltip.types';

import { Button, Tooltip, TooltipContent } from '../../primitives';

export const IconButtonWithTooltip = ({
  icon,
  label,
  tooltip,
  tooltipSide = 'right',
  tooltipSideOffset = 6,
  size = 'icon',
  variant = 'ghost',
  ...buttonProps
}: IconButtonWithTooltipProps) => (
  <Tooltip>
    <Button aria-label={label} size={size} variant={variant} {...buttonProps}>
      <span aria-hidden>{icon}</span>
    </Button>
    <TooltipContent side={tooltipSide} sideOffset={tooltipSideOffset}>
      {tooltip ?? label}
    </TooltipContent>
  </Tooltip>
);
