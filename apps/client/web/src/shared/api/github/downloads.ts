import type { AppDownloads } from '@chatovo/schemas';

import { api } from '../http';

export const getAppDownloads = async (): Promise<AppDownloads> => {
  const { data } = await api.get('/github/releases/downloads');

  return data;
};
