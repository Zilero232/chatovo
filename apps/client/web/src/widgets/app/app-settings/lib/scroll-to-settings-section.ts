import type { SettingsSectionId } from '../config/settings.types';

import { SETTINGS_SECTION_ATTRIBUTE } from '../config/section-attribute';

export const scrollToSettingsSection = (id: SettingsSectionId) => {
  const target = document.querySelector(`[${SETTINGS_SECTION_ATTRIBUTE}="${id}"]`);

  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
