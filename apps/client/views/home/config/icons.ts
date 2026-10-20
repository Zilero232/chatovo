import type { LucideIcon } from 'lucide-react';

import {
  AudioWaveform,
  Gauge,
  Keyboard,
  Link2,
  MonitorSmartphone,
  Radio,
  ScreenShare,
  ShieldCheck
} from 'lucide-react';

import type { HomeDesktopKey, HomeFeatureKey } from './sections';

export const HOME_FEATURE_ICONS: Record<HomeFeatureKey, LucideIcon> = {
  quality: AudioWaveform,
  privacy: ShieldCheck,
  screen: ScreenShare,
  link: Link2,
  free: Gauge
};

export const HOME_DESKTOP_ICONS: Record<HomeDesktopKey, LucideIcon> = {
  shortcuts: Keyboard,
  ptt: Radio,
  platforms: MonitorSmartphone
};
