'use client';

import type { Room } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToastError } from '@/entities/app/locale';
import { useCloseWhenCallAccepted } from '@/entities/social/friend';
import { getOrCreateFriendDmRoom } from '@/shared/api';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useCloseWhenInVoiceRoom } from '@/shared/hooks';
import { appEvents } from '@/shared/lib';

import type { FriendChatPeer, FriendChatSession } from '../../types';

export const useFriendChatSession = () => {
  const router = useRouter();
  const pathname = usePathname();

  const queryClient = useQueryClient();
  const toastError = useToastError();

  const [session, setSession] = useState<FriendChatSession | null>(null);
  const [openingPeer, setOpeningPeer] = useState<FriendChatPeer | null>(null);

  const openMutation = useMutation({
    mutationFn: async (peer: FriendChatPeer) => {
      const room = await queryClient.query({
        queryKey: QUERY_KEYS.friendDmRoom(peer.id),
        staleTime: Infinity,
        queryFn: () => getOrCreateFriendDmRoom(peer.id)
      });

      return { room, peer };
    },
    onSuccess: ({ room, peer }) => {
      setSession({ roomId: room.id, peer });
      setOpeningPeer(null);
    },
    onError: (error, peer) => {
      setOpeningPeer(null);
      toastError(`friend-open-dm-${peer.id}`)(error);
    }
  });

  const open = (peer: FriendChatPeer) => {
    const cachedRoom = queryClient.getQueryData<Room>(QUERY_KEYS.friendDmRoom(peer.id));

    if (cachedRoom) {
      setSession({ roomId: cachedRoom.id, peer });
      setOpeningPeer(null);
    } else {
      setOpeningPeer(peer);
      openMutation.mutate(peer);
    }

    appEvents.emit.profileCardClose();

    if (pathname !== ROUTES.lobby) {
      router.push(ROUTES.lobby);
    }
  };

  const close = () => {
    setSession(null);
    setOpeningPeer(null);
  };

  useCloseWhenInVoiceRoom(close);
  useCloseWhenCallAccepted(close);

  return {
    session,
    openingPeer,
    isOpening: openMutation.isPending,
    open,
    close
  };
};
