import { useEffect, useEffectEvent, useState } from 'react';
import { isNonNullish } from 'remeda';

import { useToastError } from '@/entities/app/locale';
import { useAppSettings } from '@/entities/app/settings';
import { useIsInvisible, useRoomToken } from '@/entities/room/room';
import { useRoomSession } from '@/entities/room/session';
import { apiErrorCode } from '@/shared/api';

import { PASSWORD_ERROR_CODES } from '../../config';

type EnteredPassword = {
  password: string;
  roomId: string;
};

export const useInvisibleModeSync = () => {
  const toastError = useToastError();

  const isInvisible = useIsInvisible();
  const { setGroup } = useAppSettings();
  const { session, open } = useRoomSession();

  const [entered, setEntered] = useState<EnteredPassword | null>(null);

  const hasChanged = isNonNullish(session) && session.isInvisible !== isInvisible;
  const enteredPassword = entered?.roomId === session?.roomId ? entered?.password : undefined;
  const password = enteredPassword ?? session?.password;

  const {
    data: token,
    error,
    isFetching,
    refetch
  } = useRoomToken(hasChanged ? session.roomId : null, { password });

  const errorCode = isNonNullish(error) ? apiErrorCode(error) : null;
  const isPasswordError = isNonNullish(errorCode) && PASSWORD_ERROR_CODES.has(errorCode);
  const isAskingPassword =
    hasChanged && (isPasswordError || (isNonNullish(enteredPassword) && isFetching));

  const keepSessionMode = () => {
    setEntered(null);

    if (session) {
      setGroup('system', { invisibleMode: session.isInvisible });
    }
  };

  const reportFailure = useEffectEvent(() => {
    toastError('invisible-mode-switch')(error);

    if (session) {
      setGroup('system', { invisibleMode: session.isInvisible });
    }
  });

  useEffect(() => {
    if (hasChanged && isNonNullish(errorCode) && !isPasswordError) {
      reportFailure();
    }
  }, [hasChanged, errorCode, isPasswordError]);

  useEffect(() => {
    if (!hasChanged || !isNonNullish(token) || !session) {
      return;
    }

    open({ ...session, token, isInvisible, password });
    // eslint-disable-next-line react/exhaustive-deps -- reopens only once a token for the new mode arrives; open is stable
  }, [hasChanged, token, isInvisible]);

  const submitPassword = (value: string) => {
    if (!session) {
      return;
    }

    if (value === enteredPassword) {
      void refetch();

      return;
    }

    setEntered({ roomId: session.roomId, password: value });
  };

  return {
    passwordPrompt: isAskingPassword
      ? {
          roomName: session.roomName,
          isWrong: errorCode === 'ROOM_PASSWORD_INVALID',
          isPending: isFetching,
          submit: submitPassword,
          cancel: keepSessionMode
        }
      : null
  };
};
