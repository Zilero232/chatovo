import type { ReactNode } from 'react';

import type { SettingsTabId } from '../../../config';

export type SettingsSidebarProps = {
  needsEmailVerification: boolean;
  tabs: { icon: ReactNode; id: SettingsTabId }[];
};
