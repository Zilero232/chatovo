'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';

import { useMiniRoomSlot } from '@/entities/room/session';
import { MEDIA_QUERIES } from '@/shared/constants';

import s from './MiniRoomFloatingSlot.module.scss';

export const MiniRoomFloatingSlot = () => {
  const { setFloatingSlot } = useMiniRoomSlot();

  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  if (isDesktop) {
    return null;
  }

  return <div ref={setFloatingSlot} className={s.root} />;
};
