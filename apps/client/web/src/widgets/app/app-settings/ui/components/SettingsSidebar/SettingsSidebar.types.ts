import type { SettingsGroupConfig, SettingsSectionId, SettingsTabId } from '../../../config';

export type SettingsSidebarProps = {
  groups: SettingsGroupConfig[];
  activeTab: SettingsTabId;
  needsEmailVerification: boolean;
  onSelectTab: (id: SettingsTabId) => void;
  onOpenSection: (id: SettingsSectionId) => void;
};
