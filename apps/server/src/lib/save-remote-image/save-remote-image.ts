import type { SavedRemoteImage, SaveRemoteImageInput } from './save-remote-image.types';

import { saveUpload, toArrayBuffer } from '../../modules/uploads';
import { buildHashKey } from '../build-hash-key';
import { fetchImage } from '../fetch-image';
import { resizeImage } from '../resize-image';

/**
 * Downloads a user-supplied image, shrinks it to WebP and stores it under `folder` in the uploads,
 * keyed by content. Null when the URL is not a reachable image.
 */
export const saveRemoteImage = async ({
  url,
  folder,
  maxBytes,
  maxWidth,
  quality
}: SaveRemoteImageInput): Promise<SavedRemoteImage | null> => {
  const original = await fetchImage({ url, maxBytes });
  const resized = original && (await resizeImage({ buffer: original, width: maxWidth, quality }));

  if (!resized) {
    return null;
  }

  const { buffer, width, height } = resized;
  const key = `${folder}/${buildHashKey([buffer])}.webp`;
  const saved = await saveUpload(key, toArrayBuffer(buffer));

  return { url: saved, width, height };
};
