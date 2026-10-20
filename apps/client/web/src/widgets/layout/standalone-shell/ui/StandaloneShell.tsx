import { BrandMark, Text } from '@chatovo/ui-kit';
import { Link } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { ArrowLeft } from 'lucide-react';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { LanguageSwitcher } from '@/widgets/app/language-switcher';

import type { StandaloneShellProps } from './StandaloneShell.types';

import s from './StandaloneShell.module.scss';

export const StandaloneShell = ({ children, backHref, backLabel }: StandaloneShellProps) => (
  <div className={clsx(s.root, 'inset-page-x')}>
    <header className={s.header}>
      <Link className={s.brand} to={ROUTES.lobby}>
        <BrandMark glow size={28} />
        <Text as='span' className={clsx(s.brandName, 'gradient-text')} tone='inherit'>
          {SITE.name}
        </Text>
      </Link>

      <div className={s.actions}>
        {backHref && backLabel && (
          <Link className={s.action} to={backHref}>
            <ArrowLeft aria-hidden className={s.actionIcon} />
            {backLabel}
          </Link>
        )}

        <LanguageSwitcher />
      </div>
    </header>

    <main className={s.body}>{children}</main>
  </div>
);
