import { readFileSync, writeFileSync } from 'node:fs';

import type { PatchFileInput } from './patch-file.types';

/** Rewrites a UTF-8 file in place through `patch`. */
export const patchFile = ({ path, patch }: PatchFileInput) => {
  writeFileSync(path, patch(readFileSync(path, 'utf8')));
};
