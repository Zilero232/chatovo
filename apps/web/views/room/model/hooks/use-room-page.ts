'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isNonNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomById, useRoomToken } from '@/entities/room/room';
import { useRoomSession } from '@/entities/room/session';
import { ROUTES } from '@/shared/constants';

import { resolvePasswordGate } from '../../lib';

export const useRoomPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();
  const { session, open, isRecentlyLeft, rejoin } = useRoomSession();

  const [passwordByRoom, setPasswordByRoom] = useState<Record<string, string>>({});

  const roomId = params.get('id');
  const titleOverride = params.get('title');
  const isChatOpen = params.get('view') === 'chat';
  const password = roomId ? passwordByRoom[roomId] : undefined;
  const isSessionOpen = session?.roomId === roomId;

  const { room, isLoading, displayName, isPrivate, isDm } = useRoomById(roomId);

  const {
    data: token,
    isError: tokenFailed,
    isFetching: tokenFetching,
    error: tokenError,
    refetch: refetchToken
  } = useRoomToken(isNonNullish(room) && !isSessionOpen ? roomId : null, { password });

  const isInvisible = isAdmin && settings.system.invisibleMode;
  const roomTitle = titleOverride ?? displayName;
  const { showPasswordForm, passwordError } = resolvePasswordGate({
    isPrivate,
    tokenFailed,
    tokenError,
    password
  });

  useEffect(() => {
    if (!roomId) {
      router.replace(ROUTES.lobby);
    }
    // eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on roomId change; router is a stable ref
  }, [roomId]);

  useEffect(() => {
    if (!isPrivate && tokenFailed) {
      router.replace(ROUTES.lobby);
    }
    // eslint-disable-next-line react/exhaustive-deps -- redirect must fire only when a public-room token fetch fails; router is a stable ref
  }, [isPrivate, tokenFailed]);

  useEffect(
    () => () => {
      rejoin();
    },
    // eslint-disable-next-line react/exhaustive-deps -- the leave guard is lifted once the room route is gone; rejoin is stable
    []
  );

  useEffect(() => {
    if (isNonNullish(roomId) && isNonNullish(token) && !isRecentlyLeft(roomId)) {
      open({
        roomId,
        roomName: roomTitle,
        token,
        isChatOpen,
        isDm,
        isPrivate,
        isInvisible,
        password
      });
    }
    // eslint-disable-next-line react/exhaustive-deps -- opening is driven by a fresh token; open is stable and roomTitle must not reopen the session
  }, [roomId, token, isChatOpen, isDm, isPrivate, isInvisible, password]);

  const submitPassword = (value: string) => {
    if (!roomId) {
      return;
    }

    if (value === password) {
      return refetchToken();
    }

    setPasswordByRoom((current) => ({ ...current, [roomId]: value }));
  };

  return {
    isDm,
    isLoading,
    isPrivate,
    isSessionOpen,
    passwordError,
    room,
    roomId,
    roomTitle,
    showPasswordForm,
    submitPassword,
    tokenFetching
  };
};
