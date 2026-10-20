import type { RefObject } from 'react';

import type { WebglTier } from '@/shared/lib';

export type ChatoCanvasProps = {
  tier: Exclude<WebglTier, 'off'>;
  isRunning: boolean;
  eventSource: RefObject<HTMLDivElement | null>;
  onReady: () => void;
};
