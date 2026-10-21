import { useEffect, useState } from 'react';

import { readSlotBox } from '../../../lib/index';
import { useRoomMusicContext } from '../../contexts';

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
      const box = readSlotBox({ slot, host });
      const key = JSON.stringify(box);

      if (key !== placed) {
        placed = key;
        host.style.visibility = box ? 'visible' : 'hidden';

        if (box) {
          host.style.transform = `translate(${box.left}px, ${box.top}px)`;
          host.style.width = `${box.width}px`;
          host.style.height = `${box.height}px`;
          host.style.clipPath = `inset(${box.clipTop}px 0 ${box.clipBottom}px 0)`;
          host.style.pointerEvents = box.isPassive ? 'none' : '';
        }
      }

      frame = requestAnimationFrame(follow);
    };

    follow();

    return () => cancelAnimationFrame(frame);
  }, [host, slot]);

  return { setHost, isRaised };
};
