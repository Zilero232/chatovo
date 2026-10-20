import type { LucideIcon } from 'lucide-react';

import { Headphones, Link2, MonitorSmartphone } from 'lucide-react';

type AuthSceneLine = {
  Icon: LucideIcon;
  key: 'everywhere' | 'invite' | 'talk';
};

export const AUTH_SCENE_LINES: AuthSceneLine[] = [
  { key: 'invite', Icon: Link2 },
  { key: 'talk', Icon: Headphones },
  { key: 'everywhere', Icon: MonitorSmartphone }
];
