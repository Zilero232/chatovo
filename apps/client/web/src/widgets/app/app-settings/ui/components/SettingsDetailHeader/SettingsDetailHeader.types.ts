import type { SettingsTabId } from '../../../config';

export type SettingsDetailHeaderProps = {
  activeTab: SettingsTabId;
  onBack: () => void;
};
