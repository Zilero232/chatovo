import { beforeEach, describe, expect, it, vi } from 'vitest';

const invoke = vi.fn(async () => {});
const listen = vi.fn(async (_event: string, _handler: unknown) => () => {});

vi.mock('@tauri-apps/api/core', () => ({ invoke }));
vi.mock('@tauri-apps/api/event', () => ({ listen }));

const { INITIAL_TRAY_STATE, pushTrayState, localizeTray, subscribeTrayAction } =
  await import('../tray-state');

const LABELS = {
  status: 'Online',
  mute: 'Mute',
  deafen: 'Deafen',
  leaveRoom: 'Leave',
  openApp: 'Open',
  checkUpdates: 'Updates',
  quit: 'Quit'
};

describe('tray api', () => {
  beforeEach(() => {
    invoke.mockClear();
    listen.mockClear();
    invoke.mockResolvedValue(undefined);
  });

  it('sends localized labels to the native menu', async () => {
    await localizeTray(LABELS);

    expect(invoke).toHaveBeenCalledWith('update_tray_labels', { labels: LABELS });
  });

  it('pushes state to the native menu', async () => {
    await pushTrayState(INITIAL_TRAY_STATE);

    expect(invoke).toHaveBeenCalledWith('update_tray_state', { state: INITIAL_TRAY_STATE });
  });

  it('listens on the action channel', () => {
    subscribeTrayAction(() => {});

    expect(listen).toHaveBeenCalledWith('tray:action', expect.any(Function));
  });

  it('swallows a failing relabel — a broken tray must not break the app', async () => {
    invoke.mockRejectedValueOnce(new Error('no tray'));

    await expect(localizeTray(LABELS)).resolves.toBeUndefined();
  });

  it('swallows a failing state push', async () => {
    invoke.mockRejectedValueOnce(new Error('gone'));

    await expect(pushTrayState(INITIAL_TRAY_STATE)).resolves.toBeUndefined();
  });

  it('starts out of a room and unmuted', () => {
    expect(INITIAL_TRAY_STATE).toEqual({
      status: '',
      isInRoom: false,
      isMuted: false,
      isDeafened: false
    });
  });
});
