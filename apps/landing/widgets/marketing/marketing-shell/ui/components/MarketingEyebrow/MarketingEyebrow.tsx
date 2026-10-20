import type { MarketingEyebrowProps } from './MarketingEyebrow.types';

import s from '../../MarketingShell.module.scss';

export const MarketingEyebrow = ({ children, size = 'md' }: MarketingEyebrowProps) => (
  <span className={s.eyebrow} data-size={size}>
    <span aria-hidden className={s.eyebrowDot} />
    {children}
  </span>
);
