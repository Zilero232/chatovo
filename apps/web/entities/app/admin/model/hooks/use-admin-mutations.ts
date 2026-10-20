'use client';

import type { BlockUserValues, UpdateAdminUserValues } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  blockAdminUser,
  deleteAdminRoom,
  resolveAdminReport,
  unblockAdminUser,
  updateAdminUser
} from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

const USERS_ROOT = 'admin-users';
const ROOMS_ROOT = 'admin-rooms';
const REPORTS_ROOT = 'admin-reports';

const useInvalidate = (root: string) => {
  const queryClient = useQueryClient();

  return () => {
    void queryClient.invalidateQueries({ queryKey: [root] });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminStats() });
  };
};

export const useBlockUser = () => {
  const invalidate = useInvalidate(USERS_ROOT);

  return useMutation({
    mutationFn: ({ userId, values }: { userId: string; values: BlockUserValues }) =>
      blockAdminUser(userId, values),
    onSuccess: invalidate
  });
};

export const useUnblockUser = () => {
  const invalidate = useInvalidate(USERS_ROOT);

  return useMutation({ mutationFn: unblockAdminUser, onSuccess: invalidate });
};

export const useUpdateUser = () => {
  const invalidate = useInvalidate(USERS_ROOT);

  return useMutation({
    mutationFn: ({ userId, values }: { userId: string; values: UpdateAdminUserValues }) =>
      updateAdminUser(userId, values),
    onSuccess: invalidate
  });
};

export const useDeleteRoomAsAdmin = () => {
  const invalidate = useInvalidate(ROOMS_ROOT);

  return useMutation({ mutationFn: deleteAdminRoom, onSuccess: invalidate });
};

export const useResolveReport = () => {
  const invalidate = useInvalidate(REPORTS_ROOT);

  return useMutation({ mutationFn: resolveAdminReport, onSuccess: invalidate });
};
