'use client';

import { createStore } from '@siberiacancode/reactuse';

import type { ConflictsState } from './conflicts.types';

export const conflictsStoreApi = createStore<ConflictsState>(() => ({ items: new Set<string>() }));
