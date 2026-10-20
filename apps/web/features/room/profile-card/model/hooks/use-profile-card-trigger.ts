'use client';

import { useRef, useState } from 'react';

import { appEvents } from '@/shared/lib';

export const useProfileCardTrigger = () => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  appEvents.on.profileCardClose(() => setIsOpen(false));

  const open = () => {
    setHasOpened(true);
    setIsOpen(true);
  };

  return { triggerRef, isOpen, hasOpened, open, setIsOpen };
};
