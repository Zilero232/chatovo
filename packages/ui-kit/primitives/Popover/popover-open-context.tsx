'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';

// eslint-disable-next-line react/no-unnecessary-use-prefix -- createContextHook requires a hook-shaped argument
const usePopoverOpenState = (isOpen: boolean) => isOpen;

const { Provider, use } = createContextHook(usePopoverOpenState);

export const PopoverOpenProvider = ({
  isOpen,
  children
}: {
  isOpen: boolean;
  children: ReactNode;
}) => <Provider params={[isOpen]}>{children}</Provider>;

/** Whether the closest `Popover` is open; `null` when the popup renders outside our wrapper. */
export const usePopoverOpen = () => use();
