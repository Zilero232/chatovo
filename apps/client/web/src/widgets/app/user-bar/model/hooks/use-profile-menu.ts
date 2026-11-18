import { useState } from 'react';

import { appEvents } from '@/shared/lib';

import type { ProfileMenuTab } from '../types';

export const useProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openSettings = (tab: ProfileMenuTab) => {
    setIsOpen(false);
    appEvents.emit.settingsOpen({ tab });
  };

  return { isOpen, setIsOpen, openSettings };
};
