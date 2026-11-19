import { createStore } from '@siberiacancode/reactuse';

import type { WatchedStreamState } from './watched-stream.types';

export const watchedStreamStoreApi = createStore<WatchedStreamState>(() => ({ identity: null }));

export const useWatchedStreamStore = watchedStreamStoreApi.use;
