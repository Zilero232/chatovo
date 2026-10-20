'use client';

import { Button, Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { useIncomingFriendRequests } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { ROUTES } from '@/shared/constants';
import { formatBadgeCount } from '@/shared/lib';

import type { LobbyButtonProps } from './LobbyButton.types';

import s from './LobbyButton.module.scss';

export const LobbyButton = ({ side = 'right', onNavigate }: LobbyButtonProps) => {
  const t = useTranslations('appSidebar');
  const router = useRouter();
  const pathname = usePathname();

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
            router.push(ROUTES.lobby);
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
