import { useMutation } from '@tanstack/react-query';

import { createShopOrder } from '@/shared/api';

export const useCreateShopOrder = () =>
  useMutation({
    mutationFn: createShopOrder
  });
