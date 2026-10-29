import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { EMPTY_DM_CALLS } from '../../config';

export const useDmCalls = () => {
  const { data: calls } = useQuery({
    queryKey: QUERY_KEYS.dmCalls(),
    queryFn: () => EMPTY_DM_CALLS,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY
  });

  return calls ?? EMPTY_DM_CALLS;
};
