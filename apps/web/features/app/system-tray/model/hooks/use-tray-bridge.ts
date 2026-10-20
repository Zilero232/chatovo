'use client';

import { useEffect, useEffectEvent } from 'react';

import { isTauriDesktop } from '@/shared/lib';

import type { TrayAction, TrayState } from '../../api/tray-state';

import { pushTrayState, subscribeTrayAction } from '../../api/tray-state';

type UseTrayBridgeInput = {
  state: TrayState;
  onAction: (action: TrayAction) => void;
};

export const useTrayBridge = ({ state, onAction }: UseTrayBridgeInput) => {
  const handleAction = useEffectEvent((action: TrayAction) => {
    onAction(action);
  });

  useEffect(() => {
    if (!isTauriDesktop()) {
      return;
    }

    const action = subscribeTrayAction((next) => handleAction(next));

    return () => {
      void action.then((off) => off());
    };
  }, []);

  useEffect(() => {
    if (!isTauriDesktop()) {
      return;
    }

    void pushTrayState(state);
  }, [state]);
};
