import { useLocation, useNavigate } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { Users } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useIncomingFriendRequests } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { ROUTES } from '@/shared/constants';
import { formatBadgeCount } from '@/shared/lib';

import type { LobbyButtonProps } from './LobbyButton.types';

import { SidebarItem } from '../SidebarItem/SidebarItem';

import s from './LobbyButton.module.scss';

export const LobbyButton = ({ variant, onNavigate }: LobbyButtonProps) => {
  const t = useTranslations('appSidebar');
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });

  const { dmUnread } = useFriendChat();
  const { data: requests } = useIncomingFriendRequests();

  const isLobby = pathname === ROUTES.lobby;
  const badgeCount = dmUnread + (requests?.length ?? 0);
  const title = variant === 'menu' ? t('home') : t('lobby');

  return (
    <SidebarItem
      badge={
        badgeCount > 0 && (
          <span className={clsx(s.badge, variant === 'rail' && s.badgeFloating)}>
            {formatBadgeCount(badgeCount)}
          </span>
        )
      }
      aria-current={isLobby ? 'page' : undefined}
      icon={<Users />}
      label={title}
      title={title}
      variant={variant}
      onClick={() => {
        navigate({ to: ROUTES.lobby });
        onNavigate?.();
      }}
    />
  );
};
