import type { LucideIcon } from 'lucide-react';

import { Globe, Mic, User, Wifi } from 'lucide-react';

import type { Messages } from '@/shared/i18n';

export type DownloadRequirementKey = keyof Messages['download']['requirements']['items'];

export const DOWNLOAD_REQUIREMENT_KEYS = [
  'browser',
  'microphone',
  'network',
  'account'
] as const satisfies readonly DownloadRequirementKey[];

export const DOWNLOAD_REQUIREMENT_ICONS: Record<DownloadRequirementKey, LucideIcon> = {
  browser: Globe,
  microphone: Mic,
  network: Wifi,
  account: User
};
