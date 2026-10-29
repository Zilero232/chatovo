import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useEffectEvent, useState } from 'react';
import { isNonNullish } from 'remeda';

import { useToastError } from '@/entities/app/locale';
import { useIsInvisible, useRoomById, useRoomToken } from '@/entities/room/room';
import { useRoomSession } from '@/entities/room/session';
import { ROUTES } from '@/shared/constants';

import { resolvePasswordGate } from '../../lib';

export const useRoomPage = () => {
  const navigate = useNavigate();
  const { id, title: titleOverride, view } = useSearch({ strict: false });

  const toastError = useToastError();

  const isInvisible = useIsInvisible();
  const { session, open, isRecentlyLeft, rejoin } = useRoomSession();

  const [passwordByRoom, setPasswordByRoom] = useState<Record<string, string>>({});

  const roomId = id ?? null;
  const isChatOpen = view === 'chat';
  const password = roomId ? passwordByRoom[roomId] : undefined;
  const isSessionOpen = session?.roomId === roomId;
  const hasLeftRoom = isNonNullish(roomId) && isRecentlyLeft(roomId);

  const { room, isLoading, displayName, isPrivate, isDm } = useRoomById(roomId);

  const {
    data: token,
    isError: tokenFailed,
    isFetching: tokenFetching,
    error: tokenError,
    refetch: refetchToken
  } = useRoomToken(isNonNullish(room) && !isSessionOpen && !hasLeftRoom ? roomId : null, {
    password
  });

  const roomTitle = titleOverride ?? displayName;
  const { isRefused, showPasswordForm, passwordError } = resolvePasswordGate({
    isPrivate,
    tokenFailed,
    tokenError,
    password
  });

  const leaveRefusedRoom = useEffectEvent(() => {
    toastError(`room-access-${roomId}`)(tokenError);
    navigate({ to: ROUTES.lobby, replace: true });
  });

  useEffect(() => {
    if (!roomId) {
      navigate({ to: ROUTES.lobby, replace: true });
    }
    // eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on roomId change; navigate is a stable ref
  }, [roomId]);

  useEffect(() => {
    if (tokenFailed && (!isPrivate || isRefused)) {
      leaveRefusedRoom();
    }
  }, [isPrivate, isRefused, tokenFailed]);

  useEffect(
    () => () => {
      rejoin();
    },
    // eslint-disable-next-line react/exhaustive-deps -- the leave guard is lifted once the room route is gone; rejoin is stable
    []
  );

  useEffect(() => {
    if (isNonNullish(roomId) && isNonNullish(token) && !hasLeftRoom) {
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
  }, [roomId, token, hasLeftRoom, isChatOpen, isDm, isPrivate, isInvisible, password]);

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
