'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { InvisibleModeMenuItem } from '@/features/app/invisible-mode';
import { ROUTES } from '@/shared/constants';

import type { AdminMenuButtonProps } from './AdminMenuButton.types';

import s from './AdminMenuButton.module.scss';

export const AdminMenuButton = ({ side = 'right', onNavigate }: AdminMenuButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('admin');
  const { isAdmin } = useCurrentUser();
  const { settings } = useAppSettings();

  if (!isAdmin) {
    return null;
  }

  const isInAdmin = pathname.startsWith(ROUTES.admin);
  const isInvisible = settings.system.invisibleMode;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={clsx(s.trigger, {
          [s.triggerActive]: isInAdmin,
          [s.triggerInvisible]: isInvisible
        })}
        aria-current={isInAdmin ? 'page' : undefined}
        aria-label={t('menuLabel')}
        size='icon'
        variant='ghost'
      >
        <Wrench />
      </DropdownMenuTrigger>

      <DropdownMenuContent align={side === 'top' ? 'start' : 'end'} className={s.menu} side={side}>
        {!isInAdmin && (
          <DropdownMenuItem
            onSelect={() => {
              router.push(ROUTES.admin);
              onNavigate?.();
            }}
          >
            <Wrench />
            {t('openPanel')}
          </DropdownMenuItem>
        )}

        <InvisibleModeMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
