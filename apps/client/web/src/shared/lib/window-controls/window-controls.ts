import { getCurrentWindow } from '@tauri-apps/api/window';

const safeWindow = async (label: string, fn: () => Promise<void>) => {
  try {
    await fn();
  } catch (err) {
    console.error(`Window ${label} failed`, err);
  }
};

export const hideMainWindow = async () => {
  await safeWindow('hide', async () => {
    await getCurrentWindow().hide();
  });
};

export const minimizeMainWindow = async () => {
  await safeWindow('minimize', async () => {
    await getCurrentWindow().minimize();
  });
};

export const toggleMaximizeMainWindow = async () => {
  await safeWindow('toggleMaximize', async () => {
    await getCurrentWindow().toggleMaximize();
  });
};

export const closeMainWindow = async () => {
  await safeWindow('close', async () => {
    await getCurrentWindow().close();
  });
};

export const isMainWindowMaximized = async () => {
  try {
    return await getCurrentWindow().isMaximized();
  } catch (err) {
    console.error('Window isMaximized failed', err);
    return false;
  }
};

export const onMainWindowResized = async (handler: () => void) => {
  try {
    return await getCurrentWindow().onResized(handler);
  } catch (err) {
    console.error('Window onResized failed', err);
    return () => {};
  }
};
