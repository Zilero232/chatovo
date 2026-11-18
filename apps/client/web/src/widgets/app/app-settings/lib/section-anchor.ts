import type { SettingsSectionId } from '../config/settings.types';

import { SETTINGS_SECTION_ATTRIBUTE } from '../config/section-attribute';

export const sectionAnchor = (id: SettingsSectionId) => ({ [SETTINGS_SECTION_ATTRIBUTE]: id });
