'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { MarketingHeaderNavProps } from './MarketingHeaderNav.types';

import s from '../../MarketingShell.module.scss';

export const MarketingHeaderNav = ({ ariaLabel, items }: MarketingHeaderNavProps) => {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className={s.headerNav}>
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.key}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(s.headerNavLink, isActive && s.headerNavLinkActive)}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
