import type { BuildDownloadUrlInput } from './build-download-url.types';

/** Asks the API to serve an upload as an attachment named `name`; the `download` attribute alone is ignored cross-origin. */
export const buildDownloadUrl = ({ url, name }: BuildDownloadUrlInput): string => {
  try {
    const download = new URL(url);

    download.searchParams.set('download', name);

    return download.toString();
  } catch {
    return url;
  }
};
