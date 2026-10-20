import type { AppDownloads, DownloadPlatform, Release, ReleaseAsset } from './types';

const EXTENSION_TO_PLATFORM: Record<string, DownloadPlatform> = {
  msi: 'windows',
  exe: 'windows',
  dmg: 'macos',
  app: 'macos',
  deb: 'linux',
  appimage: 'linux',
  rpm: 'linux'
};

/** Desktop platform an installer file is for, judged by its extension; null for anything else. */
export const detectDownloadPlatform = (filename: string): DownloadPlatform | null => {
  const extension = filename.split('.').pop()?.toLowerCase();

  return extension ? (EXTENSION_TO_PLATFORM[extension] ?? null) : null;
};

/** Picks the first installer per desktop platform out of the API's release downloads. */
export const toRelease = (downloads: AppDownloads): Release => {
  const assets: Partial<Record<DownloadPlatform, ReleaseAsset>> = {};

  for (const asset of downloads.desktop_assets) {
    const platform = detectDownloadPlatform(asset.name);

    if (!platform || assets[platform]) {
      continue;
    }

    assets[platform] = {
      platform,
      name: asset.name,
      sizeBytes: asset.size,
      downloadUrl: asset.browser_download_url
    };
  }

  return {
    assets,
    htmlUrl: downloads.html_url,
    publishedAt: downloads.published_at,
    version: downloads.version
  };
};
