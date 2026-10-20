'use client';

import type { ReactNode } from 'react';

import { isTauri } from '@tauri-apps/api/core';
import { getCurrent, onOpenUrl } from '@tauri-apps/plugin-deep-link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { parseDeepLinkToAppPath } from '@/shared/lib/deep-link';

const navigateDeepLinks = (urls: string[], navigate: (path: string) => void) => {
  for (const url of urls) {
    const path = parseDeepLinkToAppPath(url);

    if (path) {
      navigate(path);
      return;
    }
  }
};

export const DeepLinkProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isTauri()) {
      return;
    }

    let unlisten: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const current = await getCurrent();

      if (cancelled) {
        return;
      }

      if (current?.length) {
        navigateDeepLinks(current, (path) => router.replace(path));
      }

      const stop = await onOpenUrl((urls) => {
        navigateDeepLinks(urls, (path) => router.replace(path));
      });

      if (cancelled) {
        stop();
        return;
      }

      unlisten = stop;
    })();

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [router]);

  return children;
};
