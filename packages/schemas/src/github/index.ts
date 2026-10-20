export { detectDownloadPlatform, toRelease } from './lib';
export {
  appDownloadsSchema,
  gitHubContributorListSchema,
  gitHubContributorSchema,
  gitHubReleaseAssetSchema,
  gitHubReleaseListSchema,
  gitHubReleaseSchema
} from './outputs';

export type {
  AppDownloads,
  DownloadPlatform,
  GitHubContributor,
  GitHubRelease,
  GitHubReleaseAsset,
  Release,
  ReleaseAsset
} from './types';
