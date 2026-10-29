const currentWindow = async () => (await import('@tauri-apps/api/window')).getCurrentWindow();

type MainWindow = Awaited<ReturnType<typeof currentWindow>>;

const withWindow = async (label: string, action: (appWindow: MainWindow) => Promise<void>) => {
  try {
    await action(await currentWindow());
  } catch (err) {
    console.error(`Window ${label} failed`, err);
  }
};

export const hideMainWindow = () => withWindow('hide', (appWindow) => appWindow.hide());

export const minimizeMainWindow = () => withWindow('minimize', (appWindow) => appWindow.minimize());

export const toggleMaximizeMainWindow = () =>
  withWindow('toggleMaximize', (appWindow) => appWindow.toggleMaximize());

export const closeMainWindow = () => withWindow('close', (appWindow) => appWindow.close());

export const isMainWindowMaximized = async () => {
  try {
    return await (await currentWindow()).isMaximized();
  } catch (err) {
    console.error('Window isMaximized failed', err);

    return false;
  }
};

export const onMainWindowResized = async (handler: () => void) => {
  try {
    const appWindow = await currentWindow();

    return await appWindow.onResized(handler);
  } catch (err) {
    console.error('Window onResized failed', err);

    return () => {};
  }
};

/** Flashes the taskbar entry until the window is focused — for an incoming call while it is in the background. */
export const requestMainWindowAttention = () =>
  withWindow('requestUserAttention', async (appWindow) => {
    const { UserAttentionType } = await import('@tauri-apps/api/window');

    await appWindow.requestUserAttention(UserAttentionType.Critical);
  });
