import { Button, Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Users } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useIncomingFriendRequests } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { ROUTES } from '@/shared/constants';
import { formatBadgeCount } from '@/shared/lib';

import type { LobbyButtonProps } from './LobbyButton.types';

import s from './LobbyButton.module.scss';

export const LobbyButton = ({ side = 'right', onNavigate }: LobbyButtonProps) => {
  const t = useTranslations('appSidebar');
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });

  const { dmUnread } = useFriendChat();
  const { data: requests } = useIncomingFriendRequests();

  const isLobby = pathname === ROUTES.lobby;
  const badgeCount = dmUnread + (requests?.length ?? 0);

  return (
    <Tooltip>
      <span className={s.root}>
        <Button
          aria-current={isLobby ? 'page' : undefined}
          aria-label={t('lobby')}
          size='icon'
          variant='ghost'
          onClick={() => {
            navigate({ to: ROUTES.lobby });
            onNavigate?.();
          }}
        >
          <Users />
        </Button>
        {badgeCount > 0 && <span className={s.badge}>{formatBadgeCount(badgeCount)}</span>}
      </span>
      <TooltipContent side={side}>{t('lobby')}</TooltipContent>
    </Tooltip>
  );
};
