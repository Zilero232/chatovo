'use client';

import { useIntersectionObserver } from '@siberiacancode/reactuse';
import { useEffect, useEffectEvent } from 'react';

import type { UseChatOlderLoaderParams } from './use-chat-older-loader.types';

const OLDER_TRIGGER_MARGIN = '200px';

export const useChatOlderLoader = ({
  listRef,
  hasOlder,
  isLoadingOlder,
  isReady,
  loadOlder
}: UseChatOlderLoaderParams) => {
  const { ref: sentinelRef, entries } = useIntersectionObserver<HTMLDivElement>({
    root: listRef,
    rootMargin: OLDER_TRIGGER_MARGIN
  });

  const isSentinelVisible = entries?.at(-1)?.isIntersecting ?? false;

  const requestOlder = useEffectEvent(() => loadOlder());

  useEffect(() => {
    if (isSentinelVisible && hasOlder && isReady && !isLoadingOlder) {
      requestOlder();
    }
  }, [isSentinelVisible, hasOlder, isReady, isLoadingOlder]);

  return { sentinelRef };
};
