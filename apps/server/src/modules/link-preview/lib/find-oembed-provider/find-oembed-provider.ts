import type { OembedProvider } from './find-oembed-provider.types';

import { LINK_PREVIEW } from '../../config';

const PROVIDERS: readonly OembedProvider[] = LINK_PREVIEW.unfurl.oembed.providers;

export const findOembedProvider = (url: string): OembedProvider | null => {
  const hostname = URL.parse(url)?.hostname.toLowerCase();

  if (!hostname) {
    return null;
  }

  return PROVIDERS.find(({ hosts }) => hosts.includes(hostname)) ?? null;
};
