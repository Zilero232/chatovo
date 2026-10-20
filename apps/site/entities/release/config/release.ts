import type { DownloadPlatform } from '@chatovo/schemas';

import { minutesToSeconds } from 'date-fns';
import { Apple, AppWindow, Terminal } from 'lucide-react';

export type DownloadPlatformConfig = {
  Icon: typeof Apple;
  id: DownloadPlatform;
};

export const DOWNLOAD_PLATFORMS: DownloadPlatformConfig[] = [
  { id: 'windows', Icon: AppWindow },
  { id: 'macos', Icon: Apple },
  { id: 'linux', Icon: Terminal }
];

/** How long a fetched release or contributor list is served before it is refetched, in seconds. */
export const RELEASE_REVALIDATE_SECONDS = minutesToSeconds(30);
