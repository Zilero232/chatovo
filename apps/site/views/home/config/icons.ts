import type { LucideIcon } from 'lucide-react';

import {
  AudioLines,
  Keyboard,
  MessageSquareText,
  MonitorSmartphone,
  Music,
  Radio
} from 'lucide-react';

import type { HomeDesktopKey, HomeShowcaseChip } from './sections';

export const HOME_SHOWCASE_ICONS: Record<HomeShowcaseChip['key'], LucideIcon> = {
  music: Music,
  speaking: AudioLines,
  chat: MessageSquareText
};

export const HOME_DESKTOP_ICONS: Record<HomeDesktopKey, LucideIcon> = {
  shortcuts: Keyboard,
  ptt: Radio,
  platforms: MonitorSmartphone
};
