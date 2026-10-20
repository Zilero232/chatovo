import type { MouseEvent } from 'react';

export type HandleExternalLinkClickInput = {
  event: MouseEvent<HTMLAnchorElement>;
  url: string | null | undefined;
};
