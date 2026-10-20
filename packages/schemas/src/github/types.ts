import type { z } from 'zod';

import type {
  appDownloadsSchema,
  gitHubContributorSchema,
  gitHubReleaseAssetSchema,
  gitHubReleaseSchema
} from './outputs';

export type GitHubReleaseAsset = z.infer<typeof gitHubReleaseAssetSchema>;
export type GitHubRelease = z.infer<typeof gitHubReleaseSchema>;
export type AppDownloads = z.infer<typeof appDownloadsSchema>;
export type GitHubContributor = z.infer<typeof gitHubContributorSchema>;

export type DownloadPlatform = 'linux' | 'macos' | 'windows';

export type ReleaseAsset = {
  downloadUrl: string;
  name: string;
  platform: DownloadPlatform;
  sizeBytes: number;
};

export type Release = {
  assets: Partial<Record<DownloadPlatform, ReleaseAsset>>;
  htmlUrl: string;
  publishedAt: string;
  version: string;
};
