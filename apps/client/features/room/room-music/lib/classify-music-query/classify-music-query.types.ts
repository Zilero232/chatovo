import type { MusicLink } from '@chatovo/schemas';

import type { TAB_ONLY_SERVICES } from '../../config/music';

export type TabOnlyService = (typeof TAB_ONLY_SERVICES)[number]['id'];

export type MusicQuery =
  | { kind: 'idle' }
  | { kind: 'link'; link: MusicLink }
  | { kind: 'search'; query: string }
  | { kind: 'tab-only'; service: TabOnlyService };
