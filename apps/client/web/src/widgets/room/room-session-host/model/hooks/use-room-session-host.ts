import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { isNonNullish } from 'remeda';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import type { RoomLeaveOptions } from '@/entities/room/session';

import { useRoomSession } from '@/entities/room/session';
import { ROUTES } from '@/shared/constants';
import { buildRoomSearch } from '@/shared/lib';

export const useRoomSessionHost = () => {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });
  const searchRoomId = useSearch({ strict: false, select: (search) => search.id });
  const t = useTranslations('room');

  const { session, close } = useRoomSession();

  const isRoomRoute = pathname === ROUTES.room;
  const isExpanded = isRoomRoute && isNonNullish(session) && searchRoomId === session.roomId;

  const leave = (roomId: string, { isReplaced = false }: RoomLeaveOptions = {}) => {
    const isOnRoomPage = isRoomRoute && searchRoomId === roomId;

    if (isReplaced) {
      toast.info(t('movedToOtherDevice'), { id: `room-moved-${roomId}` });
    }

    close(roomId, { guardRejoin: isOnRoomPage });

    if (isOnRoomPage) {
      navigate({ to: ROUTES.lobby, replace: true });
    }
  };

  const failConnection = (roomId: string) => {
    toast.error(t('joinFailed'), { id: `room-join-${roomId}` });
    leave(roomId);
  };

  const expand = (roomId: string) => {
    navigate({ to: ROUTES.room, search: buildRoomSearch(roomId) });
  };

  return { session, isExpanded, expand, failConnection, leave };
};
