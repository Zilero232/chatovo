'use client';

import { clsx } from 'clsx';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId, useState } from 'react';

import { Button, Sheet, SheetContent, SheetDescription, SheetTitle } from '@/ui-kit';

import type { MarketingHeaderMobileNavProps } from './MarketingHeaderMobileNav.types';

import { MarketingAuthCta } from '../MarketingAuthCta/MarketingAuthCta';

import s from '../../MarketingShell.module.scss';

export const MarketingHeaderMobileNav = ({
  authLabels,
  items,
  localeSwitchHref,
  localeSwitchHrefLang,
  localeSwitchLabel,
  menuDescription,
  menuLabel,
  menuTitle
}: MarketingHeaderMobileNavProps) => {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const panelId = useId();

  const close = () => setOpen(false);

  return (
    <Sheet
      trigger={
        <Button
          aria-controls={panelId}
          aria-expanded={open}
          aria-label={menuLabel}
          className={s.headerBurger}
          size='icon'
          type='button'
          variant='ghost'
        >
          <Menu />
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
    >
      <SheetContent className={s.mobileNavSheet} id={panelId} side='right'>
        <SheetTitle className={s.mobileNavSrOnly}>{menuTitle}</SheetTitle>
        <SheetDescription className={s.mobileNavSrOnly}>{menuDescription}</SheetDescription>

        <nav aria-label={menuTitle} className={s.mobileNavLinks}>
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.key}
                aria-current={isActive ? 'page' : undefined}
                className={clsx(s.mobileNavLink, isActive && s.mobileNavLinkActive)}
                href={item.href}
                onClick={close}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={s.mobileNavActions}>
          <MarketingAuthCta
            className={s.mobileNavCta}
            openAppLabel={authLabels.openApp}
            signInLabel={authLabels.signIn}
            size='lg'
            onClick={close}
          />
          <Link
            className={clsx(s.localeSwitch, s.mobileNavLocaleSwitch)}
            href={localeSwitchHref}
            hrefLang={localeSwitchHrefLang}
            onClick={close}
          >
            {localeSwitchLabel}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
