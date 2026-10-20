import { clsx } from 'clsx';

import type { MarketingSectionProps } from './MarketingSection.types';

import s from '../../MarketingShell.module.scss';

export const MarketingSection = ({ children, id, className }: MarketingSectionProps) => (
  <section className={clsx(s.container, s.section, className)} id={id}>
    {children}
  </section>
);
