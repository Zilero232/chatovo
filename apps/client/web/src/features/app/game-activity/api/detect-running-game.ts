import { invoke } from '@tauri-apps/api/core';

export const detectRunningGame = async (): Promise<string | null> => {
  try {
    return await invoke<string | null>('detect_running_game');
  } catch {
    return null;
  }
};
