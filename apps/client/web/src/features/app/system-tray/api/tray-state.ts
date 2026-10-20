import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

export type TrayAction = 'checkUpdates' | 'leaveRoom' | 'toggleDeafen' | 'toggleMute';

export type TrayLabels = {
  checkUpdates: string;
  deafen: string;
  leaveRoom: string;
  mute: string;
  openApp: string;
  quit: string;
  status: string;
};

export type TrayState = {
  isDeafened: boolean;
  isInRoom: boolean;
  isMuted: boolean;
  status: string;
};

export const INITIAL_TRAY_STATE: TrayState = {
  status: '',
  isInRoom: false,
  isMuted: false,
  isDeafened: false
};

export const localizeTray = async (labels: TrayLabels) => {
  try {
    await invoke('update_tray_labels', { labels });
  } catch (err) {
    console.error('tray labels update failed', err);
  }
};

export const pushTrayState = async (state: TrayState) => {
  try {
    await invoke('update_tray_state', { state });
  } catch (err) {
    console.error('tray state update failed', err);
  }
};

export const subscribeTrayAction = (onAction: (action: TrayAction) => void) =>
  listen<TrayAction>('tray:action', ({ payload }) => onAction(payload));
