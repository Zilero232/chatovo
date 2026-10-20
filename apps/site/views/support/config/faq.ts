import type { LucideIcon } from 'lucide-react';

import { AudioLines, DoorOpen, MonitorSmartphone, Rocket } from 'lucide-react';

import type { Messages } from '@/shared/i18n';

export type SupportGroupKey = keyof Messages['support']['groups'];

export type SupportItemKey = keyof Messages['support']['items'];

export const SUPPORT_GROUP_ICONS: Record<SupportGroupKey, LucideIcon> = {
  start: Rocket,
  audio: AudioLines,
  rooms: DoorOpen,
  apps: MonitorSmartphone
};

export const SUPPORT_GROUP_ITEMS: Record<SupportGroupKey, readonly SupportItemKey[]> = {
  start: ['createRoom', 'invite', 'account'],
  audio: ['micNotWorking', 'micSensitivity', 'noSound', 'pushToTalk'],
  rooms: ['privateRoom', 'forgotRoomPassword', 'roomDisappeared', 'leaveRoom'],
  apps: ['updateApp', 'androidApp', 'screenShare']
};

export const SUPPORT_GROUP_KEYS = [
  'start',
  'audio',
  'rooms',
  'apps'
] as const satisfies readonly SupportGroupKey[];
