import { useNavigate } from '@tanstack/react-router';
import { useEffect, useEffectEvent } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useRoomSession } from '@/entities/room/session';
import { useDmCalls } from '@/entities/social/dm-call';
import { ROUTES } from '@/shared/constants';
import { buildRoomSearch } from '@/shared/lib';

export const useDmCallRejoinPrompt = () => {
  const t = useTranslations('room.dmCall');
  const navigate = useNavigate();

  const { current } = useDmCalls();
  const { session } = useRoomSession();

  const isAway =
    current?.state === 'active' && !current.selfInCall && session?.roomId !== current.roomId;
  const promptId = isAway ? `dm-call-rejoin-${current.id}` : null;

  const show = useEffectEvent((id: string) => {
    if (!current) {
      return;
    }

    const { roomId, peer } = current;

    toast.info(t('stillInCall', { name: peer.name }), {
      id,
      duration: Number.POSITIVE_INFINITY,
      action: {
        label: t('rejoin'),
        onClick: () =>
          navigate({ to: ROUTES.room, search: buildRoomSearch(roomId, { title: peer.name }) })
      }
    });
  });

  useEffect(() => {
    if (promptId === null) {
      return;
    }

    show(promptId);

    return () => {
      toast.dismiss(promptId);
    };
  }, [promptId]);
};
