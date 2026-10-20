import type { MarketingShellProps } from './MarketingShell.types';

import { MarketingFooter, MarketingHeader } from './components';

import s from './MarketingShell.module.scss';

export const MarketingShell = ({ children, locale, path }: MarketingShellProps) => (
  <div className={s.root}>
    <MarketingHeader locale={locale} path={path} />

    <main>{children}</main>

    <MarketingFooter locale={locale} />
  </div>
);
