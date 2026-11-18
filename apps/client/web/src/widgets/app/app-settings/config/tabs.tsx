import {
  Award,
  Keyboard,
  Mic,
  Palette,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Video,
  Volume2
} from 'lucide-react';

import type { SettingsGroupConfig } from './settings.types';

import {
  AppearanceTab,
  AudioTab,
  BadgesTab,
  GeneralTab,
  ProfileTab,
  SecurityTab,
  ShortcutsTab,
  SoundsTab,
  SystemTab,
  VideoTab
} from '../ui/sections';

export const SETTINGS_GROUPS: SettingsGroupConfig[] = [
  {
    id: 'account',
    tabs: [
      { id: 'profile', icon: <User />, render: () => <ProfileTab /> },
      {
        id: 'security',
        icon: <ShieldCheck />,
        sections: ['email', 'password', 'deleteAccount'],
        render: () => <SecurityTab />
      }
    ]
  },
  {
    id: 'customization',
    tabs: [
      {
        id: 'appearance',
        icon: <Palette />,
        render: () => <AppearanceTab />
      },
      { id: 'badges', icon: <Award />, render: () => <BadgesTab /> }
    ]
  },
  {
    id: 'voice',
    tabs: [
      {
        id: 'audio',
        icon: <Mic />,
        render: ({ jumpTo }) => <AudioTab onJumpToShortcuts={() => jumpTo('shortcuts')} />
      },
      { id: 'video', icon: <Video />, render: () => <VideoTab /> },
      { id: 'sounds', icon: <Volume2 />, render: () => <SoundsTab /> }
    ]
  },
  {
    id: 'app',
    tabs: [
      { id: 'general', icon: <SlidersHorizontal />, render: () => <GeneralTab /> },
      { id: 'system', icon: <Settings2 />, tauriDesktopOnly: true, render: () => <SystemTab /> },
      {
        id: 'shortcuts',
        icon: <Keyboard />,
        tauriDesktopOnly: true,
        render: () => <ShortcutsTab />
      }
    ]
  }
];
