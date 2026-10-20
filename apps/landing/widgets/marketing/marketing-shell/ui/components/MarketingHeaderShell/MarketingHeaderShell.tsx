'use client';

import { useIntersectionObserver } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';

import type { MarketingHeaderShellProps } from './MarketingHeaderShell.types';

import s from '../../MarketingShell.module.scss';

export const MarketingHeaderShell = ({ children }: MarketingHeaderShellProps) => {
  const { ref: sentinelRef, entries } = useIntersectionObserver<HTMLDivElement>();

  const isScrolled = entries?.[0] ? !entries[0].isIntersecting : false;

  return (
    <>
      <div aria-hidden ref={sentinelRef} className={s.headerSentinel} />

      <header className={clsx(s.header, isScrolled && s.headerScrolled)}>
        <div className={clsx(s.container, s.headerInner)}>{children}</div>
      </header>
    </>
  );
};
