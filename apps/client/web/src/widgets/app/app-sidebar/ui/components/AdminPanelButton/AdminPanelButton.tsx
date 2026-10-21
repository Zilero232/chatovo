import { useLocation, useNavigate } from '@tanstack/react-router';
import { Wrench } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ROUTES } from '@/shared/constants';

import type { AdminPanelButtonProps } from './AdminPanelButton.types';

import { SidebarItem } from '../SidebarItem/SidebarItem';

import s from './AdminPanelButton.module.scss';

export const AdminPanelButton = ({ variant, onNavigate }: AdminPanelButtonProps) => {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });

  const t = useTranslations('admin');

  const isInAdmin = pathname.startsWith(ROUTES.admin);

  return (
    <SidebarItem
      aria-current={isInAdmin ? 'page' : undefined}
      className={s[variant]}
      icon={<Wrench />}
      label={t('openPanel')}
      title={t('openPanel')}
      variant={variant}
      onClick={() => {
        navigate({ to: ROUTES.admin });
        onNavigate?.();
      }}
    />
  );
};
