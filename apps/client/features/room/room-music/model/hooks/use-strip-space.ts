'use client';

import { useEffect, useState } from 'react';

import { STRIP_SPACE } from '../../config/music';

export const useStripSpace = (isMinimized: boolean) => {
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!node) {
      return;
    }

    const room = node.parentElement;
    const root = document.documentElement;
    const { dockedVar, floatingVar, floatingGapPx } = STRIP_SPACE;

    const publish = () => {
      if (isMinimized) {
        root.style.setProperty(floatingVar, `${node.offsetHeight + floatingGapPx}px`);
        room?.style.removeProperty(dockedVar);
      } else {
        room?.style.setProperty(dockedVar, `${node.offsetTop + node.offsetHeight}px`);
        root.style.removeProperty(floatingVar);
      }
    };

    const observer = new ResizeObserver(publish);

    observer.observe(node);
    publish();

    return () => {
      observer.disconnect();
      root.style.removeProperty(floatingVar);
      room?.style.removeProperty(dockedVar);
    };
  }, [node, isMinimized]);

  return setNode;
};
