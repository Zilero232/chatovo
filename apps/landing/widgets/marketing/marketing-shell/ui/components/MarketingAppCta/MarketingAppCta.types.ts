import type { Button } from '@chatovo/ui-kit';
import type { ComponentProps, MouseEvent } from 'react';

export type MarketingAppCtaProps = {
  label: string;
  className?: string;
  size?: ComponentProps<typeof Button>['size'];
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};
