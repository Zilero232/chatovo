import type { GitHubContributor, Release } from '@chatovo/schemas';

import { appDownloadsSchema, gitHubContributorListSchema, toRelease } from '@chatovo/schemas';

import { env } from '@/shared/config';

import { RELEASE_REVALIDATE_SECONDS } from '../config';

const fetchJson = async (path: string): Promise<unknown> => {
  try {
    const response = await fetch(`${env.apiUrl}${path}`, {
      next: { revalidate: RELEASE_REVALIDATE_SECONDS }
    });

    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
};

export const getRelease = async (): Promise<Release | null> => {
  const parsed = appDownloadsSchema.safeParse(await fetchJson('/github/releases/downloads'));

  return parsed.success ? toRelease(parsed.data) : null;
};

export const getContributors = async (): Promise<GitHubContributor[]> => {
  const parsed = gitHubContributorListSchema.safeParse(await fetchJson('/github/contributors'));

  return parsed.success ? parsed.data : [];
};
