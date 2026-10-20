'use client';

import { useEffect, useState } from 'react';

import { readSlotBox } from '../../lib';
import { useRoomMusicContext } from '../contexts/room-music-context';

export const usePlayerPlacement = () => {
  const { isExpanded, barSlot, stageSlot } = useRoomMusicContext();

  const [host, setHost] = useState<HTMLElement | null>(null);

  const slot = isExpanded && stageSlot ? stageSlot : barSlot;
  const isRaised = slot !== null && slot === stageSlot;

  useEffect(() => {
    if (!host) {
      return;
    }

    let frame = 0;
    let placed = '';

    const follow = () => {
      const box = readSlotBox(slot);
      const key = JSON.stringify(box);

      if (key !== placed) {
        placed = key;
        host.style.visibility = box ? 'visible' : 'hidden';

        if (box) {
          host.style.transform = `translate(${box.left}px, ${box.top}px)`;
          host.style.width = `${box.width}px`;
          host.style.height = `${box.height}px`;
        }
      }

      frame = requestAnimationFrame(follow);
    };

    follow();

    return () => cancelAnimationFrame(frame);
  }, [host, slot]);

  return { setHost, isRaised };
};
