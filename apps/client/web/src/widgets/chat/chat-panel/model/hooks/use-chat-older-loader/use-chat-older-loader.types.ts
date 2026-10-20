import type { RefObject } from 'react';

export type UseChatOlderLoaderParams = {
  hasOlder: boolean;
  isLoadingOlder: boolean;
  isReady: boolean;
  listRef: RefObject<HTMLDivElement | null>;
  loadOlder: () => void;
};
