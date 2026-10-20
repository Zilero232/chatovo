import { Button } from '@chatovo/ui-kit';

import { APP_ROUTES } from '@/shared/constants';
import { buildAppHref } from '@/shared/lib';

import type { MarketingAppCtaProps } from './MarketingAppCta.types';

export const MarketingAppCta = ({
  label,
  className,
  size = 'sm',
  onClick
}: MarketingAppCtaProps) => (
  <Button className={className} href={buildAppHref(APP_ROUTES.lobby)} size={size} onClick={onClick}>
    {label}
  </Button>
);
