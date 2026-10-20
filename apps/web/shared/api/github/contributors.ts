import type { GitHubContributor } from '@chatovo/schemas';

import { api } from '../http';

export const listContributors = async (): Promise<GitHubContributor[]> => {
  const { data } = await api.get('/github/contributors');

  return data;
};
