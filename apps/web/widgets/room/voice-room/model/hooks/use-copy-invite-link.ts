'use client';

import { useCopy } from '@siberiacancode/reactuse';

import { buildPublicAppUrl, buildRoomHref } from '@/shared/lib';

const COPIED_RESET_MS = 2000;

export const useCopyInviteLink = (roomId: string) => {
  const { copied, copy } = useCopy(COPIED_RESET_MS);

  const copyInviteLink = () => {
    if (!roomId) {
      return;
    }

    copy(buildPublicAppUrl(buildRoomHref(roomId)));
  };

  return { canCopy: Boolean(roomId), copied, copyInviteLink };
};
