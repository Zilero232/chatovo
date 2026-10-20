'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';

import { useMiniRoomSlot } from '@/entities/room/session';
import { MEDIA_QUERIES } from '@/shared/constants';

import s from './MiniRoomSlot.module.scss';

export const MiniRoomSlot = () => {
  const { setDockedSlot } = useMiniRoomSlot();

  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  if (!isDesktop) {
    return null;
  }

  return <div ref={setDockedSlot} className={s.root} />;
};
