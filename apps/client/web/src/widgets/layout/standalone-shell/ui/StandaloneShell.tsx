import { BrandMark, Text } from '@chatovo/ui-kit';
import { Link } from '@tanstack/react-router';
import { clsx } from 'clsx';

import { LocaleSelect } from '@/entities/app/locale';
import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

import type { StandaloneShellProps } from './StandaloneShell.types';

import s from './StandaloneShell.module.scss';

export const StandaloneShell = ({ children }: StandaloneShellProps) => (
  <div className={clsx(s.root, 'inset-page-x', 'inset-page-y')}>
    <header className={s.header}>
      <Link className={s.brand} to={ROUTES.lobby}>
        <BrandMark size={30} />
        <Text as='span' className={s.brandName} tone='inherit'>
          {SITE.name}
        </Text>
      </Link>

      <LocaleSelect variant='ghost' />
    </header>

    <main className={s.body}>{children}</main>
  </div>
);
