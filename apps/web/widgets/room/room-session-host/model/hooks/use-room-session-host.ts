'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useRoomSession } from '@/entities/room/session';
import { ROUTES } from '@/shared/constants';
import { buildRoomHref } from '@/shared/lib';

export const useRoomSessionHost = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useTranslations('room');

  const { session, close } = useRoomSession();

  const isRoomRoute = pathname === ROUTES.room;
  const isExpanded = isRoomRoute && params.get('id') === session?.roomId;

  const leave = (roomId: string) => {
    close(roomId);

    if (isRoomRoute && params.get('id') === roomId) {
      router.replace(ROUTES.lobby);
    }
  };

  const failConnection = (roomId: string) => {
    toast.error(t('joinFailed'), { id: `room-join-${roomId}` });
    leave(roomId);
  };

  const expand = (roomId: string) => {
    router.push(buildRoomHref(roomId));
  };

  return { session, isExpanded, expand, failConnection, leave };
};
