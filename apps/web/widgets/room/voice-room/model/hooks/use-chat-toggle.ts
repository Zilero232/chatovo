'use client';

import { useBoolean } from '@siberiacancode/reactuse';

import { appEvents } from '@/shared/lib';

export const useChatToggle = (initialOpen: boolean) => {
  const [isChatOpen, toggleChat] = useBoolean(initialOpen);

  appEvents.on.chatToggle(() => toggleChat());

  return { isChatOpen, toggleChat };
};
