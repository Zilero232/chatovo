'use client';

import type { ReactNode } from 'react';

import { Keyboard, Mic, Settings2, ShieldCheck, User, Video, Volume2 } from 'lucide-react';

import {
  AudioTab,
  ProfileTab,
  SecurityTab,
  ShortcutsTab,
  SoundsTab,
  SystemTab,
  VideoTab
} from '../ui/sections';

export type SettingsTabId =
  'audio' | 'profile' | 'security' | 'shortcuts' | 'sounds' | 'system' | 'video';

type SettingsTabControls = {
  jumpTo: (id: SettingsTabId) => void;
};

type SettingsTabConfig = {
  icon: ReactNode;
  id: SettingsTabId;
  tauriDesktopOnly?: boolean;
  render: (controls: SettingsTabControls) => ReactNode;
};

export const SETTINGS_TABS: SettingsTabConfig[] = [
  { id: 'profile', icon: <User />, render: () => <ProfileTab /> },
  {
    id: 'audio',
    icon: <Mic />,
    render: ({ jumpTo }) => <AudioTab onJumpToShortcuts={() => jumpTo('shortcuts')} />
  },
  { id: 'video', icon: <Video />, render: () => <VideoTab /> },
  { id: 'sounds', icon: <Volume2 />, render: () => <SoundsTab /> },
  { id: 'system', icon: <Settings2 />, tauriDesktopOnly: true, render: () => <SystemTab /> },
  { id: 'shortcuts', icon: <Keyboard />, tauriDesktopOnly: true, render: () => <ShortcutsTab /> },
  { id: 'security', icon: <ShieldCheck />, render: () => <SecurityTab /> }
];
