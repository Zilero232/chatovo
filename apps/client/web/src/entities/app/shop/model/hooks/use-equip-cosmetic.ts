import { useMutation } from '@tanstack/react-query';

import { equipCosmetic, queryClient } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useEquipCosmetic = () =>
  useMutation({
    mutationFn: equipCosmetic,
    onSuccess: (state) => {
      queryClient.setQueryData(QUERY_KEYS.shopState(), state);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfiles() });
    }
  });
