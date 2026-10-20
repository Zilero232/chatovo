import { join } from 'node:path';

import type { SweepUploadFolderInput, SweepUploadFolderResult } from './sweep-upload-folder.types';

import { UPLOADS_DIR } from '../../modules/uploads';
import { listFileStats } from '../list-file-stats';
import { removeFiles } from '../remove-files';
import { selectEvictions } from '../select-evictions';

/** Deletes files in an uploads sub-folder that were last written more than `maxAgeMs` ago. */
export const sweepUploadFolder = async ({
  folder,
  maxAgeMs
}: SweepUploadFolderInput): Promise<SweepUploadFolderResult> => {
  const files = await listFileStats(join(UPLOADS_DIR, folder));
  const removed = await removeFiles(
    selectEvictions({ files, now: Date.now(), maxIdleMs: maxAgeMs, clock: 'modified' })
  );

  return { removed, total: files.length };
};
