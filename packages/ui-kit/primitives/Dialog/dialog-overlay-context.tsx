'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useState } from 'react';

const useDialogOverlayState = () => {
  const [overlayClassName, setOverlayClassName] = useState<string>();

  return { overlayClassName, setOverlayClassName };
};

const { Provider, use } = createContextHook(useDialogOverlayState);

export const DialogOverlayProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

/** Returns `null` outside `DialogOverlayProvider` — `DialogContent` may render standalone. */
export const useDialogOverlay = () => use();
