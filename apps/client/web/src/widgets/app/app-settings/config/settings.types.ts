import type { ReactNode } from 'react';

export type SettingsTabId =
  | 'appearance'
  | 'audio'
  | 'badges'
  | 'general'
  | 'profile'
  | 'security'
  | 'shortcuts'
  | 'sounds'
  | 'system'
  | 'video';

export type SettingsGroupId = 'account' | 'app' | 'customization' | 'voice';

export type SettingsSectionId = 'deleteAccount' | 'email' | 'password';

export type SettingsTabControls = {
  jumpTo: (id: SettingsTabId) => void;
};

export type SettingsTabConfig = {
  icon: ReactNode;
  id: SettingsTabId;
  sections?: SettingsSectionId[];
  tauriDesktopOnly?: boolean;
  render: (controls: SettingsTabControls) => ReactNode;
};

export type SettingsGroupConfig = {
  id: SettingsGroupId;
  tabs: SettingsTabConfig[];
};
