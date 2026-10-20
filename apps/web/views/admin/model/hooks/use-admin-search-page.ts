'use client';

import { useDebounceValue } from '@siberiacancode/reactuse';
import { useState } from 'react';

const DEBOUNCE_MS = 300;

export const useAdminSearchPage = (delay = DEBOUNCE_MS) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounceValue(search, delay);

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    search,
    searchQuery: debouncedSearch || undefined,
    page,
    setPage,
    changeSearch,
    resetPage: () => setPage(1)
  };
};
