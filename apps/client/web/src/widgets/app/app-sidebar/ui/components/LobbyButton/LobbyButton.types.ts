import type { TooltipContent } from '@chatovo/ui-kit';
import type { ComponentProps } from 'react';

export type LobbyButtonProps = {
  side?: ComponentProps<typeof TooltipContent>['side'];
  onNavigate?: () => void;
};
