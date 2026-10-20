import { useEffect, useState } from 'react';

import { FLOATING_BAR_SPACE } from '../../config/music';

export const useFloatingBarSpace = (isFloating: boolean) => {
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!node || !isFloating) {
      return;
    }

    const root = document.documentElement;
    const { cssVar, gapPx } = FLOATING_BAR_SPACE;

    const publish = () => {
      root.style.setProperty(cssVar, `${node.offsetHeight + gapPx}px`);
    };

    const observer = new ResizeObserver(publish);

    observer.observe(node);
    publish();

    return () => {
      observer.disconnect();
      root.style.removeProperty(cssVar);
    };
  }, [node, isFloating]);

  return setNode;
};
