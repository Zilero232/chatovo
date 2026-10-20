import { isTauri } from '@tauri-apps/api/core';
import { type as osType } from '@tauri-apps/plugin-os';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { isTauriDesktop, isTauriMobile } from '../tauri-platform';

vi.mock('@tauri-apps/api/core', () => ({ isTauri: vi.fn() }));
vi.mock('@tauri-apps/plugin-os', () => ({ type: vi.fn() }));

const mockPlatform = ({ tauri, os }: { os?: string; tauri: boolean }) => {
  vi.mocked(isTauri).mockReturnValue(tauri);

  if (os) {
    vi.mocked(osType).mockReturnValue(os as ReturnType<typeof osType>);
  }
};

describe('tauri-platform', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isTauriMobile', () => {
    it.each(['android', 'ios'])('is true on %s', (os) => {
      mockPlatform({ tauri: true, os });

      expect(isTauriMobile()).toBe(true);
    });

    it.each(['windows', 'macos', 'linux'])('is false on %s', (os) => {
      mockPlatform({ tauri: true, os });

      expect(isTauriMobile()).toBe(false);
    });

    it('is false in a plain browser, without asking the os plugin', () => {
      mockPlatform({ tauri: false });

      expect(isTauriMobile()).toBe(false);
      expect(osType).not.toHaveBeenCalled();
    });
  });

  describe('isTauriDesktop', () => {
    it.each(['windows', 'macos', 'linux'])('is true on %s', (os) => {
      mockPlatform({ tauri: true, os });

      expect(isTauriDesktop()).toBe(true);
    });

    it.each(['android', 'ios'])('is false on %s — updates ship through the store there', (os) => {
      mockPlatform({ tauri: true, os });

      expect(isTauriDesktop()).toBe(false);
    });

    it('is false in a plain browser', () => {
      mockPlatform({ tauri: false });

      expect(isTauriDesktop()).toBe(false);
    });
  });
});
