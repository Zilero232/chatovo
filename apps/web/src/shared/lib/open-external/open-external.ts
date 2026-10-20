import { isTauri } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';

import type { HandleExternalLinkClickInput } from './open-external.types';

const openInBrowser = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const openExternal = async (url: string): Promise<void> => {
  if (!isTauri()) {
    openInBrowser(url);

    return;
  }

  try {
    await openUrl(url);
  } catch {
    openInBrowser(url);
  }
};

/** Anchor click handler: on desktop opens the link in the system browser; on the web (or without a url) the native link behaviour stays. */
export const handleExternalLinkClick = ({ event, url }: HandleExternalLinkClickInput) => {
  if (!url || !isTauri()) {
    return;
  }

  event.preventDefault();
  openExternal(url);
};
