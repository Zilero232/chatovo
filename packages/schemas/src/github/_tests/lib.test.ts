import { describe, expect, it } from 'vitest';

import type { AppDownloads } from '../types';

import { detectDownloadPlatform, toRelease } from '../lib';

const asset = (name: string, size = 1) => ({
  name,
  size,
  browser_download_url: `https://example.com/${name}`
});

describe('detectDownloadPlatform', () => {
  it('maps installer extensions to their platform, ignoring case', () => {
    expect(detectDownloadPlatform('Chatovo_1.3.3_x64.exe')).toBe('windows');
    expect(detectDownloadPlatform('Chatovo.dmg')).toBe('macos');
    expect(detectDownloadPlatform('Chatovo.AppImage')).toBe('linux');
    expect(detectDownloadPlatform('Chatovo.EXE')).toBe('windows');
  });

  it('returns null for anything that is not a desktop installer', () => {
    expect(detectDownloadPlatform('Chatovo.apk')).toBeNull();
    expect(detectDownloadPlatform('Chatovo')).toBeNull();
    expect(detectDownloadPlatform('')).toBeNull();
  });
});

describe('toRelease', () => {
  it('keeps the first installer per platform and skips the rest', () => {
    const downloads = {
      version: '1.8.0',
      html_url: 'https://github.com/x/releases/tag/v1.8.0',
      published_at: '2026-10-20T00:00:00Z',
      desktop_assets: [asset('a.msi', 10), asset('b.exe', 20), asset('c.dmg'), asset('notes.txt')]
    } as unknown as AppDownloads;

    const release = toRelease(downloads);

    expect(release.version).toBe('1.8.0');
    expect(release.assets.windows).toEqual({
      platform: 'windows',
      name: 'a.msi',
      sizeBytes: 10,
      downloadUrl: 'https://example.com/a.msi'
    });
    expect(release.assets.macos?.name).toBe('c.dmg');
    expect(release.assets.linux).toBeUndefined();
  });
});
