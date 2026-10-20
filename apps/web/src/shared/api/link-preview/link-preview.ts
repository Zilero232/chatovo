import type { LinkPreviewResponse } from '@chatovo/schemas';

import { api } from '../http';

export const getLinkPreview = async (url: string): Promise<LinkPreviewResponse> => {
  const { data } = await api.get('/link-preview', { params: { url } });

  return data;
};
