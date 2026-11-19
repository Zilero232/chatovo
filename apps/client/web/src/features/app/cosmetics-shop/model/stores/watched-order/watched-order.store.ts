import { createStore } from '@siberiacancode/reactuse';

import type { WatchedOrderState } from './watched-order.types';

export const watchedOrderStoreApi = createStore<WatchedOrderState>(() => ({ orderId: null }));

export const useWatchedOrderStore = watchedOrderStoreApi.use;
