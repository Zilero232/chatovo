import type { ImageConfig, ImageLoaderInput } from '@chatovo/ui-kit';

import {
  IMAGE_DEFAULT_QUALITY,
  IMAGE_DEVICE_SIZES,
  IMAGE_REMOTE_HOSTS,
  IMAGE_SIZES
} from '@chatovo/schemas';

import { env } from '@/shared/config';

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const isOurUpload = (source: URL, api: URL): boolean =>
  source.origin === api.origin && source.pathname.startsWith('/uploads/');

const isAllowedRemote = (source: URL): boolean =>
  source.protocol === 'https:' && IMAGE_REMOTE_HOSTS.includes(source.hostname);

/**
 * True for an image the server optimizer accepts: one of our uploads or an allow-listed remote host.
 * Always false while the API address is not absolute, since the optimizer can't be reached then.
 */
export const isOptimizableImage = (src: string): boolean => {
  const source = parseUrl(src);
  const api = parseUrl(env.NEXT_PUBLIC_API_URL);

  if (!source || !api) {
    return false;
  }

  return isOurUpload(source, api) || isAllowedRemote(source);
};

/** Image loader: routes optimizable sources through GET /images, passes everything else through. */
export const imageLoader = ({ src, width, quality }: ImageLoaderInput): string => {
  if (!isOptimizableImage(src)) {
    return src;
  }

  const endpoint = new URL('images', `${env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}/`);

  endpoint.search = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality ?? IMAGE_DEFAULT_QUALITY)
  }).toString();

  return endpoint.toString();
};

/** The `ImageConfigProvider` config: the loader plus the widths the server optimizer accepts. */
export const IMAGE_CONFIG: ImageConfig = {
  loader: imageLoader,
  deviceSizes: IMAGE_DEVICE_SIZES,
  imageSizes: IMAGE_SIZES
};
