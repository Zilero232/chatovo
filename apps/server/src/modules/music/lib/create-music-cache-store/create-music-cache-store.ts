import { createKeyv } from 'cacheable';

import { MUSIC } from '../../config';

export const createMusicCacheStore = () => createKeyv({ lruSize: MUSIC.cacheMaxEntries });
