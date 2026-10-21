import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@chatovo/ui-kit';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { Wrench } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { InvisibleModeMenuItem } from '@/features/app/invisible-mode';
import { ROUTES } from '@/shared/constants';

import type { AdminMenuButtonProps } from './AdminMenuButton.types';

import s from './AdminMenuButton.module.scss';

export const AdminMenuButton = ({ variant, onNavigate }: AdminMenuButtonProps) => {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });

  const t = useTranslations('admin');
  const { isAdmin } = useCurrentUser();
  const { settings } = useAppSettings();

  if (!isAdmin) {
    return null;
  }

  const isInAdmin = pathname.startsWith(ROUTES.admin);
  const isInvisible = settings.system.invisibleMode;
  const isMenu = variant === 'menu';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={clsx(s.trigger, {
          [s.triggerMenu]: isMenu,
          [s.triggerActive]: isInAdmin,
          [s.triggerInvisible]: isInvisible
        })}
        aria-current={isInAdmin ? 'page' : undefined}
        aria-label={t('menuLabel')}
        size={isMenu ? 'default' : 'icon'}
        variant='ghost'
      >
        <Wrench />
        {isMenu && <span className={s.triggerTitle}>{t('menuLabel')}</span>}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isMenu ? 'start' : 'end'}
        className={s.menu}
        side={isMenu ? 'bottom' : 'right'}
      >
        {!isInAdmin && (
          <DropdownMenuItem
            onSelect={() => {
              navigate({ to: ROUTES.admin });
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
