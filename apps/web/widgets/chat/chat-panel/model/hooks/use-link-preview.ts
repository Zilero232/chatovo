'use client';

import { useQuery } from '@tanstack/react-query';

import { getLinkPreview } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useLinkPreview = (url: string) => {
  const { data: response } = useQuery({
    queryKey: QUERY_KEYS.linkPreview(url),
    queryFn: () => getLinkPreview(url),
    staleTime: Infinity,
    retry: false
  });

  return response?.preview ?? null;
};
