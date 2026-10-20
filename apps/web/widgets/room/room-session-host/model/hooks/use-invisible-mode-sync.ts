import { useEffect } from 'react';
import { isNonNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomToken } from '@/entities/room/room';
import { useRoomSession } from '@/entities/room/session';

export const useInvisibleModeSync = () => {
  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();
  const { session, open } = useRoomSession();

  const isInvisible = isAdmin && settings.system.invisibleMode;
  const hasChanged = isNonNullish(session) && session.isInvisible !== isInvisible;

  const { data: token } = useRoomToken(hasChanged ? session.roomId : null, {
    password: session?.password
  });

  useEffect(() => {
    if (!hasChanged || !isNonNullish(token) || !session) {
      return;
    }

    open({ ...session, token, isInvisible });
    // eslint-disable-next-line react/exhaustive-deps -- reopens only once a token for the new mode arrives; open is stable
  }, [hasChanged, token, isInvisible]);
};
